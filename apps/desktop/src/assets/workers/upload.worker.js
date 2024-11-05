const { parentPort, workerData } = require('worker_threads');
const FormData = require('form-data');
const fs = require('fs');

// Constants for configuration
const CHUNK_SIZE = 16 * 1024; // 16KB chunks
const PROGRESS_THROTTLE = 100; // Throttle progress updates to 100ms
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class UploadManager {
  constructor(files, uploadUrl) {
    this.files = files;
    this.uploadUrl = uploadUrl;
    this.totalSize = 0;
    this.uploadedBytes = 0;
    this.lastProgressUpdate = 0;
    this.activeStreams = new Set();
  }

  /**
   * Validate input parameters
   */
  validate() {
    if (!this.files?.length || !Array.isArray(this.files)) {
      throw new Error('Invalid or empty files array');
    }
    if (!this.uploadUrl) {
      throw new Error('Upload URL is required');
    }

    // Validate file existence and accessibility
    this.files.forEach(({ pathname }) => {
      if (!fs.existsSync(pathname)) {
        throw new Error(`File not found: ${pathname}`);
      }
      try {
        fs.accessSync(pathname, fs.constants.R_OK);
      } catch (error) {
        throw new Error(`File not readable: ${pathname}`);
      }
    });
  }

  /**
   * Calculate total size of all files
   */
  calculateTotalSize() {
    this.totalSize = this.files.reduce((total, { pathname }) => {
      const stats = fs.statSync(pathname);
      return total + stats.size;
    }, 0);
  }

  /**
   * Send progress update to parent thread
   */
  updateProgress() {
    const now = Date.now();
    if (now - this.lastProgressUpdate >= PROGRESS_THROTTLE) {
      const progress = (this.uploadedBytes / this.totalSize) * 100;
      parentPort.postMessage({
        status: 'progress',
        message: progress,
        uploadedBytes: this.uploadedBytes,
        totalSize: this.totalSize,
      });
      this.lastProgressUpdate = now;
    }
  }

  /**
   * Build form data with progress tracking
   */
  buildFormData() {
    const formData = new FormData();

    this.files.forEach(({ pathname, key }) => {
      const readStream = fs.createReadStream(pathname, {
        highWaterMark: CHUNK_SIZE,
      });
      this.activeStreams.add(readStream);

      readStream.on('data', (chunk) => {
        this.uploadedBytes += chunk.length;
        this.updateProgress();
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

  /**
   * Clean up resources
   */
  cleanup() {
    this.activeStreams.forEach((stream) => {
      stream.destroy();
    });
    this.activeStreams.clear();
  }

  /**
   * Perform upload with retries
   */
  async upload(retryCount = 0) {
    try {
      this.validate();
      this.calculateTotalSize();
      const formData = this.buildFormData();

      const fetch = (await import('node-fetch')).default;
      // Perform upload
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
        timeout: 30000, // 30 second timeout
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return { status: 'done', message: result };
    } catch (error) {
      this.cleanup();

      // Handle retries for specific error types
      if (
        retryCount < MAX_RETRIES &&
        (error.code === 'ETIMEDOUT' ||
          error.code === 'ECONNRESET' ||
          error.name === 'AbortError')
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
        );
        return this.upload(retryCount + 1);
      }

      return {
        status: 'error',
        message: error.message,
        retries: retryCount,
      };
    }
  }
}

let uploadManager;

// Worker message handler
parentPort.on('message', async () => {
  const { files, url } = workerData;
  uploadManager = new UploadManager(files, url);

  try {
    const result = await uploadManager.upload();
    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({
      status: 'error',
      message: error.message,
    });
  } finally {
    uploadManager.cleanup();
  }
});

// Handle worker termination
process.on('SIGTERM', () => {
  uploadManager?.cleanup();
  process.exit(0);
});
