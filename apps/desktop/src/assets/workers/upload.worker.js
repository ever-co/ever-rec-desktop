const { parentPort, workerData } = require('worker_threads');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

function buildFormData(files, formData) {
  let totalSize = 0;
  let uploadedBytes = 0;

  files.forEach(({ pathname, key }) => {
    const fileStats = fs.statSync(pathname);
    totalSize += fileStats.size;

    const readStream = fs.createReadStream(pathname);
    formData.append(key, readStream);

    readStream.on('data', (chunk) => {
      uploadedBytes += chunk.length;
      const progress = (uploadedBytes / totalSize) * 100;
      parentPort.postMessage({
        status: 'progress',
        message: progress.toFixed(2),
      });
    });

    readStream.on('error', (error) => {
      parentPort.postMessage({
        status: 'error',
        message: `Error reading file ${pathname}: ${error.message}`,
      });
    });

    readStream.on('close', () => {
      readStream.destroy();
    });
  });

  return formData;
}

async function upload(files, uploadUrl) {
  if (!files || !Array.isArray(files) || files.length === 0 || !uploadUrl) {
    return { status: 'error', message: 'Missing required parameters' };
  }

  const formData = buildFormData(files, new FormData());

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: formData,
      timeout: 30000,
    });

    if (!response.ok) {
      return { status: 'error', message: `Upload failed: ${response.status} ${response.statusText}` };
    }

    const result = await response.json();
    return { status: 'done', message: result };
  } catch (error) {
    return { status: 'error', message: `Upload error: ${error.message}` };
  } finally {
    // Ensure all streams are closed properly
    files.forEach(({ pathname }) => {
      const readStream = fs.createReadStream(pathname);
      readStream.close();
    });
  }
}

parentPort.on('message', async () => {
  const { files, url } = workerData;
  const result = await upload(files, url);
  parentPort.postMessage(result);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  parentPort.postMessage({
    status: 'error',
    message: 'Unhandled rejection in upload worker',
  });
});
