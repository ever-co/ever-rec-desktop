const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const FormData = require('form-data');

// Constants for configuration
const CHUNK_SIZE = 16 * 1024; // 16KB chunks
const PROGRESS_THROTTLE = 100; // Throttle progress updates to 100ms
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Service for file validation
class FileValidator {
  static validateFiles(files) {
    if (!files?.length || !Array.isArray(files)) {
      throw new Error('Invalid or empty files array');
    }

    files.forEach(({ pathname }) => {
      if (!fs.existsSync(pathname)) {
        throw new Error(`File not found: ${pathname}`);
      }
      try {
        fs.accessSync(pathname, fs.constants.R_OK);
      } catch {
        throw new Error(`File not readable: ${pathname}`);
      }
    });
  }
}

// Service for calculating file sizes
class FileSizeCalculator {
  static calculateTotalSize(files) {
    return files.reduce((total, { pathname }) => {
      const stats = fs.statSync(pathname);
      return total + stats.size;
    }, 0);
  }
}

// Retry strategy
class RetryStrategy {
  constructor(maxRetries, retryDelay) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async executeWithRetry(fn, retryCount = 0) {
    try {
      return await fn();
    } catch (error) {
      if (
        retryCount < this.maxRetries &&
        ['ETIMEDOUT', 'ECONNRESET', 'AbortError'].includes(
          error.code || error.name
        )
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * (retryCount + 1))
        );
        return this.executeWithRetry(fn, retryCount + 1);
      }
      throw error;
    }
  }
}

// Upload manager responsible for uploading files
class UploadManager {
  constructor(files, uploadUrl, progressNotifier, retryStrategy) {
    this.files = files;
    this.uploadUrl = uploadUrl;
    this.progressNotifier = progressNotifier;
    this.retryStrategy = retryStrategy;

    this.totalSize = 0;
    this.uploadedBytes = 0;
    this.lastProgressUpdate = 0;
    this.activeStreams = new Set();
  }

  async prepareUpload() {
    FileValidator.validateFiles(this.files);
    this.totalSize = FileSizeCalculator.calculateTotalSize(this.files);
  }

  createFormData() {
    const formData = new FormData();

    this.files.forEach(({ pathname, key }) => {
      const readStream = fs.createReadStream(pathname, {
        highWaterMark: CHUNK_SIZE,
      });
      this.activeStreams.add(readStream);

      readStream.on('data', (chunk) => {
        this.uploadedBytes += chunk.length;
        this.progressNotifier.notifyProgress(
          this.uploadedBytes,
          this.totalSize
        );
      });

      readStream.on('error', (error) => {
        this.cleanup();
        throw new Error(`Stream error for ${pathname}: ${error.message}`);
      });

      readStream.on('end', () => {
        this.activeStreams.delete(readStream);
        readStream.destroy();
      });

      formData.append(key, readStream);
    });

    return formData;
  }

  cleanup() {
    this.activeStreams.forEach((stream) => stream.destroy());
    this.activeStreams.clear();
  }

  async upload() {
    const formData = this.createFormData();
    const fetch = (await import('node-fetch')).default;

    return this.retryStrategy.executeWithRetry(async () => {
      const response = await fetch(this.uploadUrl, {
        method: 'PUT',
        body: formData,
        timeout: 30000,
        headers: { ...formData.getHeaders() },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    });
  }
}

// Progress notification service
class ProgressNotifier {
  constructor(progressThrottle, port) {
    this.progressThrottle = progressThrottle;
    this.port = port;
    this.lastProgressUpdate = 0;
  }

  notifyProgress(uploadedBytes, totalSize) {
    const now = Date.now();
    if (now - this.lastProgressUpdate >= this.progressThrottle) {
      const progress = (uploadedBytes / totalSize) * 100;
      this.port.postMessage({
        status: 'progress',
        message: progress,
        uploadedBytes: uploadedBytes,
        totalSize: totalSize,
      });
      this.lastProgressUpdate = now;
    }
  }
}

// Factory to create an UploadManager instance
class UploadManagerFactory {
  static create(files, uploadUrl) {
    const progressNotifier = new ProgressNotifier(
      PROGRESS_THROTTLE,
      parentPort
    );
    const retryStrategy = new RetryStrategy(MAX_RETRIES, RETRY_DELAY);
    return new UploadManager(files, uploadUrl, progressNotifier, retryStrategy);
  }
}

let uploadManager;

// Worker message handler
parentPort.on('message', async () => {
  const { files, url } = workerData;
  uploadManager = UploadManagerFactory.create(files, url);

  try {
    await uploadManager.prepareUpload();
    const result = await uploadManager.upload();
    parentPort.postMessage({ status: 'done', message: result });
  } catch (error) {
    parentPort.postMessage({ status: 'error', message: error.message });
  } finally {
    uploadManager.cleanup();
  }
});

// Handle worker termination
process.on('SIGTERM', () => {
  uploadManager?.cleanup();
  process.exit(0);
});
