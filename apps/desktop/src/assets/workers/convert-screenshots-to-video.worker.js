const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

FfmpegCommand.setFfmpegPath(ffmpegPath);

parentPort.on('message', (message) => {
  if (message.command === 'start') {
    const { outputPath, filePathnames, config } = workerData;
    processVideos(filePathnames, outputPath, config);
  }
});

function processVideos(filePathnames, outputPath, config) {
  const batches = splitIntoBatches(filePathnames, 100);
  const videoFiles = [];

  let processedBatches = 0;

  batches.forEach((batch, index) => {
    convertBatchToVideo(
      batch,
      index,
      outputPath,
      config,
      (error, videoFile) => {
        if (error) {
          parentPort.postMessage({ status: 'error', message: error.message });
          return;
        }

        videoFiles.push(videoFile);
        processedBatches += 1;

        if (processedBatches === batches.length) {
          concatenateVideos(
            videoFiles,
            outputPath,
            (concatError, finalVideo) => {
              if (concatError) {
                parentPort.postMessage({
                  status: 'error',
                  message: concatError.message,
                });
              } else {
                parentPort.postMessage({ status: 'done', message: finalVideo });
              }
            }
          );
        }
      }
    );
  });
}

function splitIntoBatches(arr, batchSize) {
  const batches = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    batches.push(arr.slice(i, i + batchSize));
  }
  return batches;
}

function convertBatchToVideo(batch, batchIndex, outputPath, config, callback) {
  const command = new FfmpegCommand();
  const filterComplex = [];
  const duration = config.duration ? config.duration / batch.length : 2;

  batch.forEach((file, index) => {
    command.input(file);
    filterComplex.push(
      `[${index}:v]scale=${
        config.resolution || '1920:1080'
      },setpts=PTS-STARTPTS+${duration}/TB[v${index}]`
    );
  });

  const concatFilter = filterComplex.map((_, index) => `[v${index}]`).join('');
  filterComplex.push(`${concatFilter}concat=n=${batch.length}:v=1:a=0[vout]`);

  const batchOutputPath = `${outputPath}_batch_${batchIndex}.mp4`;

  command
    .complexFilter(filterComplex)
    .outputOptions('-map [vout]')
    .videoCodec(config.codec || 'libx264')
    .outputOptions('-pix_fmt yuv420p')
    .outputOptions('-preset veryfast')
    .outputOptions('-crf 23')
    .output(batchOutputPath)
    .on('end', () => {
      console.log(
        `Batch ${batchIndex} processing completed: ${batchOutputPath}`
      );
      callback(null, batchOutputPath);
    })
    .on('error', (error) => {
      console.log(`Error processing batch ${batchIndex}: ${error.message}`);
      callback(error, null);
    })
    .run();
}

function concatenateVideos(videoFiles, finalOutputPath, callback) {
  const command = new FfmpegCommand();

  videoFiles.forEach((video) => {
    command.input(video);
  });

  command
    .complexFilter([
      {
        filter: 'concat',
        options: {
          n: videoFiles.length,
          v: 1,
          a: 0,
        },
      },
    ])
    .outputOptions('-pix_fmt yuv420p')
    .output(finalOutputPath)
    .on('end', () => {
      console.log(`Final video created: ${finalOutputPath}`);
      callback(null, finalOutputPath);
    })
    .on('error', (error) => {
      console.log(`Error concatenating videos: ${error.message}`);
      callback(error, null);
    })
    .run();
}
