const { parentPort, workerData } = require('worker_threads');
const FormData = require('form-data');
const fs = require('fs').promises;
const { createReadStream } = require('fs');

async function buildFormData(files, formData) {
  let totalSize = 0;
  let uploadedBytes = 0;

  await Promise.all(files.map(async ({ pathname, key }) => {
    const fileStats = await fs.stat(pathname);
    totalSize += fileStats.size;

    const readStream = createReadStream(pathname);
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
  }));

  return formData;
}

async function upload(files, uploadUrl) {
  if (!files || !Array.isArray(files) || files.length === 0 || !uploadUrl) {
    throw new Error('Missing required parameters');
  }

  const formData = await buildFormData(files, new FormData());

  try {
    const fetch = (await import('node-fetch')).default;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Upload timed out');
    }
    throw error;
  }
}

parentPort.on('message', async () => {
  const { files, url } = workerData;
  try {
    const result = await upload(files, url);
    parentPort.postMessage({ status: 'done', message: result });
  } catch (error) {
    parentPort.postMessage({ status: 'error', message: error.message });
  } finally {
    // Ensure all streams are closed properly
    await Promise.all(files.map(async ({ pathname }) => {
      const readStream = createReadStream(pathname);
      await new Promise((resolve) => {
        readStream.on('close', resolve);
        readStream.destroy();
      });
    }));
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  parentPort.postMessage({
    status: 'error',
    message: 'Unhandled rejection in upload worker',
  });
});
