const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
);

const ffmpegProbPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
);

FfmpegCommand.setFfmpegPath(ffmpegPath);
FfmpegCommand.setFfprobePath(ffmpegProbPath);

parentPort.on('message', (message) => {
  if (message.command === 'start') {
    const { batchVideoPaths, finalOutputPath } = workerData;
    combineVideos(batchVideoPaths, finalOutputPath);
  }
});

function combineVideos(batchVideoPaths, finalOutputPath) {
  const command = new FfmpegCommand();
  const frames = batchVideoPaths.length;

  batchVideoPaths.forEach((video) => {
    command.input(video);
  });

  command
    .complexFilter([
      {
        filter: 'concat',
        options: {
          n: frames,
          v: 1,
          a: 0,
        },
      },
    ])
    .outputOptions('-pix_fmt yuv420p')
    .output(finalOutputPath)
    .on('progress', (progress) => {
      const percent = (progress.frames * 100) / frames;
      parentPort.postMessage({ status: 'progress', message: percent });
    })
    .on('end', () =>
      parentPort.postMessage({ status: 'done', message: finalOutputPath })
    )
    .on('error', (error) =>
      parentPort.postMessage({ status: 'error', message: error.message })
    )
    .run();
}
