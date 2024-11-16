const { parentPort } = require('worker_threads');

class Timer {
  constructor() {
    this.secondsElapsed = 0;
    this.intervalId = null;
    this.isRunning = false;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Handle worker messages
    parentPort.on('message', (message) => {
      try {
        this.handleMessage(message);
      } catch (error) {
        this.handleError(error);
      }
    });

    // Handle worker termination
    parentPort.on('close', () => {
      this.cleanup();
    });

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      this.handleError(error);
      this.cleanup();
    });
  }

  handleMessage(message) {
    const { action } = message;

    switch (action) {
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'getElapsed':
        this.getElapsed();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  start() {
    if (this.isRunning) {
      this.handleError(new Error('Timer is already running'));
      return;
    }

    this.isRunning = true;

    this.sendMessage('start');

    this.intervalId = setInterval(() => {
      try {
        this.secondsElapsed++;
        this.sendMessage('tick', { secondsElapsed: this.secondsElapsed });
      } catch (error) {
        this.handleError(error);
      }
    }, 1000);
  }

  stop() {
    if (!this.isRunning) {
      this.handleError(new Error('Timer is not running'));
      return;
    }

    this.cleanup();
    this.sendMessage('stop', { secondsElapsed: this.secondsElapsed });
    this.secondsElapsed = 0;
  }

  getElapsed() {
    this.sendMessage('getElapsed', { secondsElapsed: this.secondsElapsed });
  }

  cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  sendMessage(action, data) {
    try {
      parentPort.postMessage({ action, ...data });
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error('Worker error:', error);
    this.sendMessage('error', {
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

// Initialize timer
new Timer();
