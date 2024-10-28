const { workerData, parentPort } = require('worker_threads');
const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static');
const path = require('path');
const fs = require('fs').promises;

/**
 * Configure FFmpeg paths for Electron (handling asar packaging)
 */
function setupFfmpeg() {
  try {
    const ffmpeg = ffmpegPath.replace('app.asar', 'app.asar.unpacked');
    const ffprobe = ffprobePath.path.replace('app.asar', 'app.asar.unpacked');

    FfmpegCommand.setFfmpegPath(ffmpeg);
    FfmpegCommand.setFfprobePath(ffprobe);

    sendMessage('info', 'FFmpeg paths configured successfully');
  } catch (error) {
    sendMessage('error', `Failed to configure FFmpeg paths: ${error.message}`);
    throw error;
  }
}

/**
 * Send a structured message to the parent thread
 * @param {string} status - Message status
 * @param {*} message - Message content
 * @param {Object} [extra] - Additional data
 */
function sendMessage(status, message, extra = {}) {
  if (parentPort) {
    parentPort.postMessage({
      status,
      message,
      timestamp: Date.now(),
      ...extra
    });
  }
}

/**
 * Get video information using ffprobe
 * @param {string} videoPath - Path to video file
 * @returns {Promise<Object>} Video metadata
 */
function getVideoInfo(videoPath) {
  return new Promise((resolve, reject) => {
    FfmpegCommand.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
}

/**
 * Validate input videos and get total duration
 * @param {string[]} videoPaths - Array of video paths
 * @returns {Promise<{totalFrames: number, totalDuration: number}>}
 */
async function validateVideos(videoPaths) {
  if (!Array.isArray(videoPaths) || videoPaths.length === 0) {
    throw new Error('No input videos provided');
  }

  let totalFrames = 0;
  let totalDuration = 0;

  await Promise.all(videoPaths.map(async (videoPath) => {
    try {
      await fs.access(videoPath);
      const info = await getVideoInfo(videoPath);

      const stream = info.streams.find(s => s.codec_type === 'video');
      if (!stream) {
        throw new Error(`No video stream found in ${videoPath}`);
      }

      // Calculate frames and duration
      const duration = parseFloat(info.format.duration);
      const frameRate = eval(stream.r_frame_rate); // Convert fraction to number
      const frames = Math.ceil(duration * frameRate);

      totalFrames += frames;
      totalDuration += duration;
    } catch (error) {
      throw new Error(`Error processing ${videoPath}: ${error.message}`);
    }
  }));

  return { totalFrames, totalDuration };
}

/**
 * Combine multiple videos into a single video
 * @param {string[]} batchVideoPaths - Array of video paths
 * @param {string} finalOutputPath - Output path for combined video
 * @param {Object} options - Additional options
 */
async function combineVideos(
  batchVideoPaths,
  finalOutputPath,
  {
    codec = 'libx264',
    preset = 'medium',
    crf = 23,
    pixelFormat = 'yuv420p',
    videoBitrate = '0', // Auto
    maxBitrate = null,
    bufsize = null
  } = {}
) {
  const startTime = Date.now();
  let lastProgressUpdate = 0;
  const progressUpdateInterval = 100; // ms

  try {
    // Validate output directory
    const outputDir = path.dirname(finalOutputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Validate videos and get total frames/duration
    const { totalFrames, totalDuration } = await validateVideos(batchVideoPaths);
    sendMessage('info', 'Videos validated successfully', { totalFrames, totalDuration });

    const command = new FfmpegCommand();

    // Add input videos
    batchVideoPaths.forEach(video => {
      command.input(video);
    });

    // Prepare filter complex
    const inputs = batchVideoPaths.map((_, index) => `[${index}:v]`).join('');
    const filterComplex = [
      {
        filter: 'concat',
        options: {
          n: batchVideoPaths.length,
          v: 1,
          a: 0
        },
        inputs: inputs,
        outputs: 'output'
      }
    ];

    // Configure output options
    const outputOptions = [
      '-map [output]',
      `-c:v ${codec}`,
      `-preset ${preset}`,
      `-crf ${crf}`,
      `-pix_fmt ${pixelFormat}`,
      '-movflags +faststart'
    ];

    // Add bitrate control if specified
    if (maxBitrate) {
      outputOptions.push(`-maxrate ${maxBitrate}`);
      outputOptions.push(`-bufsize ${bufsize || maxBitrate}`);
    }
    if (videoBitrate !== '0') {
      outputOptions.push(`-b:v ${videoBitrate}`);
    }

    command
      .complexFilter(filterComplex)
      .outputOptions(outputOptions)
      .output(finalOutputPath);

    // Set up event handlers
    command
      .on('start', (commandLine) => {
        sendMessage('start', 'Starting video combination', { commandLine });
      })
      .on('progress', (progress) => {
        const now = Date.now();
        // Throttle progress updates
        if (now - lastProgressUpdate >= progressUpdateInterval) {
          const percent = (progress.frames * 100) / totalFrames;
          const elapsedTime = now - startTime;
          const estimatedTotalTime = (elapsedTime / percent) * 100;

          sendMessage('progress', percent, {
            frames: progress.frames,
            totalFrames,
            fps: progress.currentFps,
            timemark: progress.timemark,
            elapsedTime,
            estimatedTimeRemaining: estimatedTotalTime - elapsedTime
          });

          lastProgressUpdate = now;
        }
      })
      .on('end', () => {
        const duration = Date.now() - startTime;
        sendMessage('done', finalOutputPath, {
          duration,
          totalDuration,
          processingSpeed: (totalDuration / (duration / 1000)).toFixed(2) + 'x'
        });
      })
      .on('error', (error) => {
        sendMessage('error', error.message, {
          command: command._getArguments().join(' ')
        });
      });

    // Run the command
    command.run();
  } catch (error) {
    sendMessage('error', error.message);
  }
}

// Initialize FFmpeg paths
setupFfmpeg();

// Handle incoming messages
parentPort.on('message', async (message) => {
  if (message.command === 'start') {
    const { batchVideoPaths, finalOutputPath, options = {} } = workerData;
    await combineVideos(batchVideoPaths, finalOutputPath, options);
  }
});

// Handle worker errors
process.on('uncaughtException', (error) => {
  sendMessage('error', `Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (error) => {
  sendMessage('error', `Unhandled rejection: ${error.message}`);
});
