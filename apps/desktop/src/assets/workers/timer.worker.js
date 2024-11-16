const { parentPort } = require('worker_threads');
const { EventEmitter } = require('events');

// Interface for time provider
class TimeProvider {
  getInterval() {
    throw new Error('Method not implemented');
  }

  clearInterval(id) {
    throw new Error('Method not implemented');
  }
}

// Concrete implementation of time provider
class NodeTimeProvider extends TimeProvider {
  getInterval(callback, delay) {
    return setInterval(callback, delay);
  }

  clearInterval(id) {
    clearInterval(id);
  }
}

// Message port adapter to abstract worker thread communication
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

// State management using State pattern
class TimerState {
  constructor(timer) {
    this.timer = timer;
  }

  start() {
    throw new Error('Method not implemented');
  }

  stop() {
    throw new Error('Method not implemented');
  }

  pause() {
    throw new Error('Method not implemented');
  }

  resume() {
    throw new Error('Method not implemented');
  }
}

class StoppedState extends TimerState {
  start() {
    this.timer.isRunning = true;
    this.timer.messagePort.send('start');
    this.timer.startCounting();
    return new RunningState(this.timer);
  }

  stop() {
    throw new Error('Timer is not running');
  }

  pause() {
    throw new Error('Timer is not running');
  }

  resume() {
    throw new Error('Timer is not running');
  }
}

class RunningState extends TimerState {
  start() {
    throw new Error('Timer is already running');
  }

  stop() {
    this.timer.cleanup();
    this.timer.messagePort.send('stop', { secondsElapsed: this.timer.secondsElapsed });
    this.timer.secondsElapsed = 0;
    return new StoppedState(this.timer);
  }

  pause() {
    this.timer.isPaused = true;
    this.timer.messagePort.send('pause');
    this.timer.stopCounting();
    return new PausedState(this.timer);
  }

  resume() {
    throw new Error('Timer is not paused');
  }
}

class PausedState extends TimerState {
  start() {
    throw new Error('Timer is already running');
  }

  stop() {
    this.timer.cleanup();
    this.timer.messagePort.send('stop', { secondsElapsed: this.timer.secondsElapsed });
    this.timer.secondsElapsed = 0;
    return new StoppedState(this.timer);
  }

  pause() {
    throw new Error('Timer is already paused');
  }

  resume() {
    this.timer.isPaused = false;
    this.timer.messagePort.send('resume');
    this.timer.startCounting();
    return new RunningState(this.timer);
  }
}

// Error handler
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

    this.messagePort.onClose(() => {
      this.cleanup();
    });

    process.on('uncaughtException', (error) => {
      this.errorHandler.handle(error);
      this.cleanup();
    });
  }

  handleMessage(message) {
    const { action } = message;

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
        throw new Error(`Unknown action: ${action}`);
    }
  }

  startCounting() {
    this.intervalId = this.timeProvider.getInterval(() => {
      try {
        this.secondsElapsed++;
        this.messagePort.send('tick', { secondsElapsed: this.secondsElapsed });
      } catch (error) {
        this.errorHandler.handle(error);
      }
    }, 1000);
  }

  stopCounting() {
    if (this.intervalId) {
      this.timeProvider.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getElapsed() {
    this.messagePort.send('getElapsed', { secondsElapsed: this.secondsElapsed });
  }

  cleanup() {
    this.stopCounting();
    this.isRunning = false;
  }
}

// Initialize dependencies and timer
const messagePort = new MessagePortAdapter(parentPort);
const timeProvider = new NodeTimeProvider();
const errorHandler = new ErrorHandler(messagePort);
new Timer(messagePort, timeProvider, errorHandler);
