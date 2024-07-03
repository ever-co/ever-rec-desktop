const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

FfmpegCommand.setFfmpegPath(ffmpegPath);

parentPort.on('message', (message) => {
  if (message.command === 'start') {
    const { outputPath, filePathnames, config } = workerData;
    convertImagesToVideo(filePathnames, outputPath, config);
  }
});

function convertImagesToVideo(filePathnames, outputPath, config) {
  if (!Array.isArray(filePathnames) || filePathnames.length === 0) {
    parentPort.postMessage({ status: 'error', message: 'No images provided' });
    return;
  }

  const command = new FfmpegCommand();
  const filterComplex = [];
  const duration = config.duration ? config.duration / filePathnames.length : 2; // Default to 2 seconds per image

  filePathnames.forEach((file, index) => {
    command.input(file);
    filterComplex.push(
      `[${index}:v]scale=${
        config.resolution || '1920:1080'
      },setpts=PTS-STARTPTS+${duration}/TB[v${index}]`
    );
  });

  const concatFilter = filterComplex.map((_, index) => `[v${index}]`).join('');
  filterComplex.push(
    `${concatFilter}concat=n=${filePathnames.length}:v=1:a=0[vout]`
  );

  command
    .complexFilter(filterComplex)
    .outputOptions('-map [vout]')
    .videoCodec(config.codec || 'libx264')
    .outputOptions('-pix_fmt yuv420p') // Ensure compatibility with most players
    .outputOptions('-preset veryfast') // Adjusts encoding speed vs. quality trade-off
    .outputOptions('-crf 23'); // Quality setting for H.264

  command
    .output(outputPath)
    .on('start', (cmdline) => console.log(`Started: ${cmdline}`))
    .on('progress', (progress) => {
      const totalFrames = filePathnames.length;
      const framesProcessed = progress.frames || 0;
      const percentComplete = (framesProcessed / totalFrames) * 100;
      parentPort.postMessage({
        status: 'progress',
        message: percentComplete,
      });
    })
    .on('end', () => {
      parentPort.postMessage({ status: 'done', message: outputPath });
    })
    .on('error', (error) => {
      parentPort.postMessage({ status: 'error', message: error });
    })
    .run();
}
