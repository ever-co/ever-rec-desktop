const { promises: fs, createWriteStream, createReadStream } = require('fs');
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
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Operation handlers
async function handleWrite(payload) {
  const { directory, fileName, buffer, log } = payload;

  if (!directory || !fileName || !buffer) {
    throw new Error('Missing required parameters for write operation');
  }
  if (!validatePath(directory) || !validatePath(fileName)) {
    throw new Error('Invalid path detected');
  }

  try {
    const dirPath = join(userDataPath, directory);
    const filePath = join(dirPath, fileName);

    await ensureDirectory(dirPath);

    const properBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    // Stream the buffer directly to the file
    await pipeline(Readable.from(properBuffer), createWriteStream(filePath));

    if (log) {
      console.log(`File successfully written: ${filePath}`);
    }

    return sendResponse({ status: 'done', data: filePath });
  } catch (error) {
    console.error('Error in handleWrite:', error);
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

  try {
    const files = await fs.readdir(dirPath);
    sendResponse({ status: 'done', data: files });
  } catch (error) {
    sendResponse({ status: 'done', data: [] });
  }
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

  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    sendResponse({ status: 'done' });
  } catch (error) {
    console.error('Error in handleRemoveAllFiles:', error);
    throw new Error(`Failed to remove files: ${error.message}`);
  }
}

async function handleDeleteFile(payload) {
  const { filePath } = payload;

  if (!filePath) {
    throw new Error('File path is required');
  }
  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    await fs.unlink(filePath);
    sendResponse({ status: 'done' });
  } catch (error) {
    console.error('Error in handleDeleteFile:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

async function handleReadFile(payload) {
  const { filePath, onData } = payload;

  if (!filePath) {
    throw new Error('File path is required');
  }
  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    const readStream = createReadStream(filePath, { highWaterMark: 32 * 1024 });

    readStream.on('data', (chunk) => {
      onData({ status: 'streaming', data: chunk, done: false });
    });

    await new Promise((resolve, reject) => {
      readStream.on('end', resolve);
      readStream.on('error', reject);
    });

    sendResponse({ status: 'done', done: true });
  } catch (error) {
    console.error('Error in handleReadFile:', error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
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

  sendResponse({ status: 'done', data: join(dirPath, filename) });
}

async function handleGetFileSize(payload) {
  const { filePath } = payload;

  if (!filePath) {
    throw new Error('File path is required');
  }
  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }

  try {
    const stats = await fs.stat(filePath);
    sendResponse({ status: 'done', data: stats.size });
  } catch (error) {
    console.error('Error in handleGetFileSize:', error);
    throw new Error(`Failed to get file size: ${error.message}`);
  }
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
