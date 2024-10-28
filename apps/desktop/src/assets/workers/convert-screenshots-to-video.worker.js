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
      ...extra,
    });
  }
}

/**
 * Validate input files and configuration
 * @param {string[]} files - Array of file paths
 * @param {string} output - Output path
 * @param {Object} config - Configuration object
 */
async function validateInputs(files, output, config) {
  // Validate files
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('No input files provided');
  }

  // Check file existence and type
  const validExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];
  await Promise.all(
    files.map(async (file) => {
      try {
        await fs.access(file);
        const ext = path.extname(file).toLowerCase();
        if (!validExtensions.includes(ext)) {
          throw new Error(`Invalid image format: ${file}`);
        }
      } catch (error) {
        throw new Error(`File access error: ${file} - ${error.message}`);
      }
    })
  );

  // Validate output directory
  const outputDir = path.dirname(output);
  await fs.mkdir(outputDir, { recursive: true });

  // Validate config
  if (
    config.frameRate &&
    (config.frameRate <= 0 || !Number.isFinite(config.frameRate))
  ) {
    throw new Error('Invalid frameRate: must be a positive number');
  }

  if (config.resolution && !/^\d+:\d+$/.test(config.resolution)) {
    throw new Error('Invalid resolution format: must be width:height');
  }
}

/**
 * Convert images to video with enhanced error handling and progress tracking
 * @param {string[]} filePathnames - Array of image paths
 * @param {string} outputPath - Output video path
 * @param {Object} config - Configuration options
 */
async function convertImagesToVideo(
  filePathnames,
  outputPath,
  {
    frameRate = 2,
    resolution = '1920:1080',
    codec = 'libx264',
    preset = 'veryfast',
    crf = 23,
    pixelFormat = 'yuv420p',
  } = {}
) {
  const startTime = Date.now();
  let lastProgressUpdate = 0;
  const progressUpdateInterval = 100; // ms

  try {
    await validateInputs(filePathnames, outputPath, { frameRate, resolution });

    const command = new FfmpegCommand();
    const filterComplex = [];
    const duration = 1 / frameRate;
    const totalFrames = filePathnames.length;

    // Add inputs and prepare filters
    filePathnames.forEach((file, index) => {
      command.input(file).inputFPS(frameRate);
      filterComplex.push(
        `[${index}:v]scale=${resolution}:force_original_aspect_ratio=decrease,` +
          `pad=${resolution}:(ow-iw)/2:(oh-ih)/2,` +
          `setpts=PTS-STARTPTS+${duration}/TB[v${index}]`
      );
    });

    // Prepare concat filter
    const concatFilter = filterComplex
      .map((_, index) => `[v${index}]`)
      .join('');
    filterComplex.push(`${concatFilter}concat=n=${totalFrames}:v=1:a=0[vout]`);

    // Set up command with enhanced options
    command
      .complexFilter(filterComplex)
      .outputOptions([
        '-map [vout]',
        `-c:v ${codec}`,
        `-pix_fmt ${pixelFormat}`,
        `-preset ${preset}`,
        `-crf ${crf}`,
        '-movflags +faststart',
      ])
      .output(outputPath);

    // Event handlers
    command
      .on('start', (commandLine) => {
        sendMessage('start', 'Starting conversion', { commandLine });
      })
      .on('progress', (progress) => {
        const now = Date.now();
        // Throttle progress updates
        if (now - lastProgressUpdate >= progressUpdateInterval) {
          const percent = (progress.frames / totalFrames) * 100;
          const elapsedTime = now - startTime;
          const estimatedTotalTime = (elapsedTime / percent) * 100;

          sendMessage('progress', percent, {
            frames: progress.frames,
            totalFrames,
            fps: progress.currentFps,
            timemark: progress.timemark,
            elapsedTime,
            estimatedTimeRemaining: estimatedTotalTime - elapsedTime,
          });

          lastProgressUpdate = now;
        }
      })
      .on('end', () => {
        const duration = Date.now() - startTime;
        sendMessage('done', outputPath, {
          duration,
          avgFps: totalFrames / (duration / 1000),
        });
      })
      .on('error', (error) => {
        sendMessage('error', error.message, {
          command: command._getArguments().join(' '),
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
    const { filePathnames, outputPath, config } = workerData;
    await convertImagesToVideo(filePathnames, outputPath, config);
  }
});

// Handle worker errors
process.on('uncaughtException', (error) => {
  sendMessage('error', `Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (error) => {
  sendMessage('error', `Unhandled rejection: ${error.message}`);
});
