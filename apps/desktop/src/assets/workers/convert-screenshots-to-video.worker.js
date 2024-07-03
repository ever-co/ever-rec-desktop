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

  filePathnames.forEach((file) => command.input(file));

  if (config.frameRate) {
    command.inputOptions(`-r ${config.frameRate}`);
  }

  if (config.resolution) {
    command.inputOptions(`-r ${config.resolution}`);
  }

  if (config.codec) {
    command.outputOptions(`-c:v ${config.codec}`);
  }

  if (config.duration) {
    command.outputOptions(`-t ${config.duration}`);
  }

  command
    .outputOptions('-pix_fmt yuv420p') // Ensure compatibility with most players
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
