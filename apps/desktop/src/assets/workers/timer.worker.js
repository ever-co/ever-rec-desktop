const { parentPort } = require('worker_threads');
const { EventEmitter } = require('events');

// Base TimeProvider interface
class TimeProvider {
  getInterval() {
    throw new Error('Method not implemented');
  }

  clearInterval(id) {
    throw new Error('Method not implemented');
  }
}

// Node.js implementation of TimeProvider
class NodeTimeProvider extends TimeProvider {
  getInterval(callback, delay) {
    return setInterval(callback, delay);
  }

  clearInterval(id) {
    clearInterval(id);
  }
}

// Adapter for communication via MessagePort
class MessagePortAdapter {
  constructor(port) {
    this.port = port;
  }

  send(action, data = {}) {
    try {
      this.port.postMessage({ action, ...data });
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  onMessage(callback) {
    this.port.on('message', callback);
  }

  onClose(callback) {
    this.port.on('close', callback);
  }
}

// Base class for Timer states
class TimerState {
  constructor(timer) {
    this.timer = timer;
  }

  start() {
    this.timer.errorHandler.handle(
      'Start operation not allowed in this state.'
    );
  }

  stop() {
    this.timer.errorHandler.handle('Stop operation not allowed in this state.');
  }

  pause() {
    this.timer.errorHandler.handle(
      'Pause operation not allowed in this state.'
    );
  }

  resume() {
    this.timer.errorHandler.handle(
      'Resume operation not allowed in this state.'
    );
  }
}

class StoppedState extends TimerState {
  start() {
    this.timer.isRunning = true;
    this.timer.messagePort.send('start');
    this.timer.startCounting();
    return new RunningState(this.timer);
  }
}

class RunningState extends TimerState {
  stop() {
    this.timer.cleanup();
    this.timer.messagePort.send('stop', {
      secondsElapsed: this.timer.secondsElapsed,
    });
    return new StoppedState(this.timer);
  }

  pause() {
    this.timer.isPaused = true;
    this.timer.stopCounting();
    return new PausedState(this.timer);
  }
}

class PausedState extends TimerState {
  stop() {
    this.timer.cleanup();
    this.timer.messagePort.send('stop', {
      secondsElapsed: this.timer.secondsElapsed,
    });
    return new StoppedState(this.timer);
  }

  resume() {
    this.timer.isPaused = false;
    this.timer.startCounting();
    return new RunningState(this.timer);
  }
}

// Handles errors and sends them via MessagePort
class ErrorHandler {
  constructor(messagePort) {
    this.messagePort = messagePort;
  }

  handle(error) {
    console.error('Worker error:', error);
    this.messagePort.send('error', {
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

// Main Timer class
class Timer extends EventEmitter {
  constructor(messagePort, timeProvider, errorHandler) {
    super();
    this.messagePort = messagePort;
    this.timeProvider = timeProvider;
    this.errorHandler = errorHandler;
    this.secondsElapsed = 0;
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.state = new StoppedState(this);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.messagePort.onMessage((message) => {
      try {
        this.handleMessage(message);
      } catch (error) {
        this.errorHandler.handle(error);
      }
    });

    this.messagePort.onClose(() => this.cleanup());

    process.on('uncaughtException', (error) => {
      this.errorHandler.handle(error);
      this.cleanup();
    });
  }

  handleMessage({ action }) {
    switch (action) {
      case 'start':
        this.state = this.state.start();
        break;
      case 'stop':
        this.state = this.state.stop();
        break;
      case 'getElapsed':
        this.getElapsed();
        break;
      case 'pause':
        this.state = this.state.pause();
        break;
      case 'resume':
        this.state = this.state.resume();
        break;
      default:
        this.errorHandler.handle(`Unknown action: ${action}`);
    }
  }

  startCounting() {
    this.stopCounting();
    this.intervalId = this.timeProvider.getInterval(() => {
      this.secondsElapsed++;
      this.messagePort.send('tick', { secondsElapsed: this.secondsElapsed });
    }, 1000);
  }

  stopCounting() {
    if (this.intervalId) {
      this.timeProvider.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getElapsed() {
    this.messagePort.send('getElapsed', {
      secondsElapsed: this.secondsElapsed,
    });
  }

  cleanup() {
    this.stopCounting();
    this.isRunning = false;
  }
}

// Initialize and run Timer
const messagePort = new MessagePortAdapter(parentPort);
const timeProvider = new NodeTimeProvider();
const errorHandler = new ErrorHandler(messagePort);
new Timer(messagePort, timeProvider, errorHandler);
