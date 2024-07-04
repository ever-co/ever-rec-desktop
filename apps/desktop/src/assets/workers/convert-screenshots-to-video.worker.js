const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

FfmpegCommand.setFfmpegPath(ffmpegPath);

parentPort.on('message', (message) => {
  if (message.command === 'start') {
    const { filePathnames, outputPath, config } = workerData;
    convertImagesToVideo(filePathnames, outputPath, config);
  }
});

function convertImagesToVideo(filePathnames, outputPath, config) {
  const command = new FfmpegCommand();
  const filterComplex = [];
  const duration = 1 / config.frameRate || 2;
  const frames = filePathnames.length;

  filePathnames.forEach((file, index) => {
    command.input(file);
    filterComplex.push(
      `[${index}:v]scale=${
        config.resolution || '1920:1080'
      },setpts=PTS-STARTPTS+${duration}/TB[v${index}]`
    );
  });

  const concatFilter = filterComplex.map((_, index) => `[v${index}]`).join('');
  filterComplex.push(`${concatFilter}concat=n=${frames}:v=1:a=0[vout]`);

  command
    .complexFilter(filterComplex)
    .outputOptions('-map [vout]')
    .videoCodec(config.codec || 'libx264')
    .outputOptions('-pix_fmt yuv420p')
    .outputOptions('-preset veryfast')
    .outputOptions('-crf 23')
    .output(outputPath)
    .on('progress', (progress) => {
      const percent = (progress.frames * 100) / frames;
      parentPort.postMessage({ status: 'progress', message: percent });
    })
    .on('end', () =>
      parentPort.postMessage({ status: 'done', message: outputPath })
    )
    .on('error', (error) =>
      parentPort.postMessage({ status: 'error', message: error })
    )
    .run();
}
