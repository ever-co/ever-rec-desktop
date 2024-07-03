const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

FfmpegCommand.setFfmpegPath(ffmpegPath);

parentPort.on('message', (message) => {
  if (message.command === 'start') {
    const {
      outputPath,
      filePathnames,
      frameRate = 1,
      resolution = '1920x1080',
    } = workerData;
    convertImagesToVideo(filePathnames, outputPath, frameRate, resolution);
  }
});

function convertImagesToVideo(
  filePathnames,
  outputPath,
  frameRate,
  resolution
) {
  if (!Array.isArray(filePathnames) || filePathnames.length === 0) {
    parentPort.postMessage({ status: 'error', message: 'No images provided' });
    return;
  }

  const command = new FfmpegCommand();
  const totalFrames = filePathnames.length;
  filePathnames.forEach((file) => command.input(file));

  command
    .inputOptions('-r ' + frameRate)
    .outputOptions(`-vf scale=${resolution}`)
    .outputOptions('-pix_fmt yuv420p') // Ensure compatibility with most players
    .outputOptions('-c:v libx264') // Use H.264 codec
    .outputOptions('-crf 23') // Quality setting for H.264 (0-51, lower is better quality)
    .outputOptions('-preset veryfast') // Adjusts encoding speed vs. quality trade-off
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
