const { parentPort, workerData } = require('worker_threads');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

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
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return { status: 'error', message: 'Upload failed::' + response.status };
    }

    const result = await response.json();
    return { status: 'success', message: result };
  } catch (error) {
    return { status: 'error', message: error.message ?? error };
  } finally {
    for (const file of files) {
      const readStream = fs.createReadStream(file.path);
      if (readStream) {
        readStream.close();
      }
    }
  }
}

parentPort.on('message', async () => {
  const { files, uploadUrl } = workerData;
  const result = await upload(files, uploadUrl);
  parentPort.postMessage(result);
});
