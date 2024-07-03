const { parentPort, workerData } = require('worker_threads');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

parentPort.on('message', async (message) => {
  if (message.command === 'start') {
    const { outputPath } = message;
    console.log(workerData.screenshots);
    //convertImagesToVideo(workerData.screenshots, outputPath);
    parentPort.postMessage({
      status: 'done',
      message: 'file:///Users/adkif/Documents/GitHub/ever-prototype/apps/ui/src/assets/unwrapped-adkif.mp4',
    });
  }
});

function convertImagesToVideo(images, outputPath) {
  const video = ffmpeg();
  const totalFrames = images.length;
  let currentFrame = 0;

  images.forEach((image) => {
    video.input(image).inputOption('-loop 1').inputOption('-t 2'); // Each image displays for 2 seconds
  });

  video
    .output(outputPath)
    .videoCodec('libx264')
    .on('progress', () => {
      currentFrame++;
      const percentComplete = (currentFrame / totalFrames) * 100;
      parentPort.postMessage({
        status: 'progress',
        progress: percentComplete,
      });
    })
    .on('end', () => parentPort.postMessage({ status: 'done', outputPath }))
    .on('error', (error) => parentPort.postMessage({ status: 'error', error }))
    .run();
}
