const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

FfmpegCommand.setFfmpegPath(ffmpegPath);

parentPort.on('message', (message) => {
  if (message.command === 'start') {
    const { outputPath, filePathnames } = workerData;
    convertImagesToVideo(filePathnames, outputPath);
  }
});

function convertImagesToVideo(filePathnames, outputPath) {
  const command = new FfmpegCommand();
  const totalFrames = filePathnames.length;
  filePathnames.forEach((file) => command.input(file));

  command
    .output(outputPath)
    .on('start', (cmdline) => console.log(`Started: ${cmdline}`))
    .on('progress', (progress) => {
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
