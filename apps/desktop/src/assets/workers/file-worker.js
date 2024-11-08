const {
  existsSync,
  promises: fs,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  createWriteStream,
} = require('fs');
const { join } = require('path');
const { parentPort, workerData } = require('worker_threads');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');

// Constants
const { userDataPath } = workerData;

// Helper functions
function sendResponse(response) {
  parentPort?.postMessage(response);
}

function validatePath(path) {
  return !path.includes('..') && !path.includes('~');
}

async function ensureDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Operation handlers
/**
 * @param {Object} payload
 * @param {string} payload.directory - Target directory
 * @param {string} payload.fileName - Name of the file to write
 * @param {Buffer|Uint8Array|number[]} payload.buffer - Data to write
 * @param {boolean} [payload.log] - Whether to log the operation
 * @returns {Promise<void>}
 */
async function handleWrite(payload) {
  const { directory, fileName, buffer, log } = payload;

  // Input validation
  if (!directory || !fileName || !buffer) {
    throw new Error('Missing required parameters for write operation');
  }

  if (!validatePath(directory) || !validatePath(fileName)) {
    throw new Error('Invalid path detected');
  }

  let writeStream;
  try {
    // Prepare paths
    const dirPath = join(userDataPath, directory);
    const filePath = join(dirPath, fileName);

    // Ensure directory exists
    await ensureDirectory(dirPath);

    // Convert buffer to proper Buffer if it's an array of numbers
    const properBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    // Create write stream with error handling
    writeStream = createWriteStream(filePath, {
      flags: 'w',
    });

    // Write the buffer directly to the stream
    writeStream.write(properBuffer);
    writeStream.end();

    // Wait for the 'finish' event
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    if (log) {
      console.log(`File successfully written: ${filePath}`);
    }

    return sendResponse({
      status: 'done',
      data: filePath,
    });
  } catch (error) {
    // Log error details for debugging
    console.error('Error in handleWrite:', error);

    // Clean up any partially written file if needed
    if (writeStream && !writeStream.closed) {
      writeStream.destroy();
    }

    throw new Error(`Failed to write file: ${error.message}`);
  }
}

async function handleGetFiles(payload) {
  const { directory } = payload;

  if (!directory) {
    throw new Error('Directory is required');
  }

  if (!validatePath(directory)) {
    throw new Error('Invalid directory path');
  }

  const dirPath = join(userDataPath, directory);

  if (!existsSync(dirPath)) {
    sendResponse({ status: 'done', data: [] });
    return;
  }

  const files = readdirSync(dirPath);
  sendResponse({ status: 'done', data: files });
}

async function handleRemoveAllFiles(payload) {
  const { directory } = payload;

  if (!directory) {
    throw new Error('Directory is required');
  }

  if (!validatePath(directory)) {
    throw new Error('Invalid directory path');
  }

  const dirPath = join(userDataPath, directory);

  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true });
  }

  sendResponse({ status: 'done' });
}

async function handleDeleteFile(payload) {
  const { filePath } = payload;

  if (!filePath) {
    throw new Error('File path is required');
  }

  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }

  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }

  sendResponse({ status: 'done' });
}

async function handleReadFile(payload) {
  const { filePath } = payload;

  if (!filePath) {
    throw new Error('File path is required');
  }

  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }

  const data = readFileSync(filePath);
  sendResponse({ status: 'done', data });
}

async function handleCreateFilePath(payload) {
  const { filename, directory } = payload;

  if (!filename || !directory) {
    throw new Error('Filename and directory are required');
  }

  if (!validatePath(directory) || !validatePath(filename)) {
    throw new Error('Invalid path detected');
  }

  const dirPath = join(userDataPath, directory);
  await ensureDirectory(dirPath);

  sendResponse({
    status: 'done',
    data: join(dirPath, filename),
  });
}

async function handleGetFileSize(payload) {
  const { filePath } = payload;

  if (!filePath) {
    throw new Error('File path is required');
  }

  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }

  const stats = await fs.stat(filePath);
  sendResponse({ status: 'done', data: stats.size });
}

// Main message handler
const operationHandlers = {
  write: handleWrite,
  getFiles: handleGetFiles,
  removeAllFiles: handleRemoveAllFiles,
  deleteFile: handleDeleteFile,
  readFile: handleReadFile,
  createFilePath: handleCreateFilePath,
  getFileSize: handleGetFileSize,
};

parentPort?.on('message', async (message) => {
  const { operation, payload } = message;

  try {
    const handler = operationHandlers[operation];
    if (!handler) {
      throw new Error(`Unknown operation: ${operation}`);
    }

    await handler(payload);
  } catch (error) {
    console.error(`Error in ${operation} operation:`, error);
    sendResponse({
      status: 'error',
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
});
