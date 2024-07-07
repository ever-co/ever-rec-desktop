const fs = require('fs');
const { join } = require('path');
const { parentPort, workerData } = require('worker_threads');
const {
  existsSync,
  promises: fsPromises,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
} = fs;

const { userDataPath } = workerData;

// Receive message from parent thread
parentPort?.on('message', async ({ operation, payload }) => {
  switch (operation) {
    case 'write':
      await handleWrite(payload);
      break;
    case 'getFiles':
      handleGetFiles(payload);
      break;
    case 'removeAllFiles':
      handleRemoveAllFiles(payload);
      break;
    case 'deleteFile':
      handleDeleteFile(payload);
      break;
    case 'readFile':
      handleReadFile(payload);
      break;
    case 'createFilePath':
      await handleCreateFilePath(payload);
      break;
  }
});

async function handleWrite(payload) {
  const { directory, fileName, buffer, log } = payload;

  try {
    const dirPath = join(userDataPath, directory);
    const filePath = join(dirPath, fileName);

    if (!existsSync(dirPath)) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }

    await fsPromises.writeFile(filePath, buffer);

    if (log) {
      console.log(`File written: ${filePath}`);
    }

    parentPort?.postMessage({ status: 'done', data: filePath });
  } catch (error) {
    console.error('Failed to save file:', error);
    parentPort?.postMessage({ status: 'error', error });
  }
}

function handleGetFiles(payload) {
  const { directory } = payload;

  try {
    const dirPath = join(userDataPath, directory);

    if (!existsSync(dirPath)) {
      parentPort?.postMessage({ status: 'done', data: [] });
      return;
    }

    const files = readdirSync(dirPath);

    parentPort?.postMessage({ status: 'done', data: files });
  } catch (error) {
    console.error(`Failed to read directory: ${directory}`, error);
    parentPort?.postMessage({ status: 'error', error });
  }
}

function handleRemoveAllFiles(payload) {
  const { directory } = payload;

  try {
    const dirPath = join(userDataPath, directory);

    if (existsSync(dirPath)) {
      rmSync(dirPath, { recursive: true });
    }

    parentPort?.postMessage({ status: 'done' });
  } catch (error) {
    console.warn(`An Error occurred while removing all files ${directory}`);
    parentPort?.postMessage({ status: 'error', error });
  }
}

function handleDeleteFile(payload) {
  const { filePath } = payload;

  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    parentPort?.postMessage({ status: 'done' });
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
    parentPort?.postMessage({ status: 'error', error });
  }
}

function handleReadFile(payload) {
  const { filePath } = payload;

  try {
    const data = readFileSync(filePath);
    parentPort?.postMessage({ status: 'done', data: data });
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error);
    parentPort?.postMessage({ status: 'error', error });
  }
}

async function handleCreateFilePath(payload) {
  try {
    const { filename, directory } = payload;

    const dirPath = join(userDataPath, directory);

    if (!existsSync(dirPath)) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }
    parentPort?.postMessage({
      status: 'done',
      data: join(dirPath, filename),
    });
  } catch (error) {
    parentPort?.postMessage({ status: 'error', error });
  }
}
