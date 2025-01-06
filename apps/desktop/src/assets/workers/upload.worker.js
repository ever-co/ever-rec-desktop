const { parentPort, workerData } = require('worker_threads');
const { promises: fs, createReadStream } = require('fs');
const FormData = require('form-data');

// Constants for configuration
const CHUNK_SIZE = 16 * 1024; // 16KB chunks
const PROGRESS_THROTTLE = 100; // Throttle progress updates to 100ms
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Service for file validation
class FileValidator {
  static async validateFiles(files) {
    if (!files?.length || !Array.isArray(files)) {
      throw new Error('Invalid or empty files array');
    }
    for (const { pathname } of files) {
      try {
        await fs.access(pathname);
      } catch {
        throw new Error(`File not accessible: ${pathname}`);
      }
    }
  }
}

// Service for calculating file sizes
class FileSizeCalculator {
  static async calculateTotalSize(files) {
    let totalSize = 0;
    for (const { pathname } of files) {
      const stats = await fs.stat(pathname);
      totalSize += stats.size;
    }
    return totalSize;
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
  constructor(files, config, progressNotifier, retryStrategy) {
    this.files = files;
    this.config = config;
    this.progressNotifier = progressNotifier;
    this.retryStrategy = retryStrategy;
    this.totalSize = 0;
    this.uploadedBytes = 0;
    this.activeStreams = new Set();
  }

  async prepareUpload() {
    await FileValidator.validateFiles(this.files);
    this.totalSize = await FileSizeCalculator.calculateTotalSize(this.files);
  }

  createFormData() {
    const formData = new FormData();

    this.files.forEach(({ pathname, key }) => {
      const readStream = createReadStream(pathname, {
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

    const headers = {}; // Ensure headers exist if they are not part of FormData by default

    if (this.config?.organizationId) {
      const { organizationId } = this.config;
      formData.append('organizationId', organizationId);
      headers['Organization-Id'] = organizationId;
    }

    if (this.config?.tenantId) {
      const { tenantId } = this.config;
      formData.append('tenantId', tenantId);
      headers['Tenant-Id'] = tenantId;
    }

    if (this.config?.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

    return this.retryStrategy.executeWithRetry(async () => {
      const response = await fetch(this.config.url, {
        method: this.config?.token ? 'POST' : 'PUT',
        body: formData,
        timeout: 30000,
        headers,
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
        uploadedBytes,
        totalSize,
      });
      this.lastProgressUpdate = now;
    }
  }
}

// Factory to create an UploadManager instance
class UploadManagerFactory {
  static create(files, config) {
    const progressNotifier = new ProgressNotifier(
      PROGRESS_THROTTLE,
      parentPort
    );
    const retryStrategy = new RetryStrategy(MAX_RETRIES, RETRY_DELAY);
    return new UploadManager(files, config, progressNotifier, retryStrategy);
  }
}

let uploadManager;

// Worker message handler
parentPort.on('message', async () => {
  const { files, config } = workerData;
  uploadManager = UploadManagerFactory.create(files, config);

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
