// Dependencies
const { parentPort } = require('worker_threads');

// Constants
const TIMER_STATES = {
  STOPPED: 'STOPPED',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
};

const ERROR_CODES = {
  INVALID_STATE: 'INVALID_STATE',
  INVALID_TRANSITION: 'INVALID_TRANSITION',
  COMMAND_ERROR: 'COMMAND_ERROR',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
};

// Base Interfaces
class ITimeProvider {
  getInterval() {
    throw new Error('Not implemented');
  }
  clearInterval() {
    throw new Error('Not implemented');
  }
}

class IMessagePort {
  send() {
    throw new Error('Not implemented');
  }
  onMessage() {
    throw new Error('Not implemented');
  }
  onClose() {
    throw new Error('Not implemented');
  }
}

// Implementations
class NodeTimeProvider extends ITimeProvider {
  getInterval(callback, delay) {
    if (typeof callback !== 'function') {
      throw new TimerError(
        'Invalid callback provided',
        ERROR_CODES.COMMAND_ERROR
      );
    }
    return setInterval(callback, delay);
  }

  clearInterval(id) {
    if (id) clearInterval(id);
  }
}

class MessagePortAdapter extends IMessagePort {
  constructor(port) {
    super();
    if (!port)
      throw new TimerError('Invalid message port', ERROR_CODES.COMMAND_ERROR);
    this.port = port;
  }

  send(action, data = {}) {
    try {
      if (!action)
        throw new TimerError('Invalid action', ERROR_CODES.COMMAND_ERROR);
      this.port.postMessage({ action, ...data });
    } catch (error) {
      throw new TimerError(
        `MessagePort error: ${error.message}`,
        ERROR_CODES.COMMAND_ERROR
      );
    }
  }

  onMessage(callback) {
    if (typeof callback !== 'function') {
      throw new TimerError(
        'Invalid message callback',
        ERROR_CODES.COMMAND_ERROR
      );
    }
    this.port.on('message', callback);
  }

  onClose(callback) {
    if (typeof callback !== 'function') {
      throw new TimerError('Invalid close callback', ERROR_CODES.COMMAND_ERROR);
    }
    this.port.on('close', callback);
  }
}

// Enhanced Error Handling
class TimerError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'TimerError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class WorkerErrorHandler {
  constructor(messagePort) {
    this.messagePort = messagePort;
  }

  handle(error) {
    const errorObj = this.formatError(error);
    console.error('Worker error:', errorObj);
    this.messagePort.send('error', { error: errorObj });
  }

  formatError(error) {
    return {
      name: error.name || 'Error',
      message: error.message,
      code: error.code || ERROR_CODES.UNKNOWN_ACTION,
      details: error.details || {},
      stack: error.stack,
      timestamp: error.timestamp || new Date().toISOString(),
    };
  }
}

// State Management
class StateManager {
  constructor(timer) {
    this.timer = timer;
    this.currentState = TIMER_STATES.STOPPED;
    this.transitions = {
      [TIMER_STATES.STOPPED]: { start: TIMER_STATES.RUNNING },
      [TIMER_STATES.RUNNING]: {
        stop: TIMER_STATES.STOPPED,
        pause: TIMER_STATES.PAUSED,
      },
      [TIMER_STATES.PAUSED]: {
        resume: TIMER_STATES.RUNNING,
        stop: TIMER_STATES.STOPPED,
      },
    };
  }

  transition(action) {
    const nextState = this.transitions[this.currentState]?.[action];

    if (!nextState) {
      throw new TimerError(
        `Invalid state transition: ${action} from ${this.currentState}`,
        ERROR_CODES.INVALID_TRANSITION,
        { currentState: this.currentState, action }
      );
    }

    this.currentState = nextState;
    return this.currentState;
  }

  getState() {
    return this.currentState;
  }
}

// Command Pattern Implementation
class TimerCommandExecutor {
  constructor(timer) {
    this.timer = timer;
    this.commands = {
      start: () => this.executeStart(),
      stop: () => this.executeStop(),
      pause: () => this.executePause(),
      resume: () => this.executeResume(),
      getElapsed: () => this.executeGetElapsed(),
    };
  }

  execute(action) {
    const command = this.commands[action];
    if (!command) {
      throw new TimerError(
        `Unknown command: ${action}`,
        ERROR_CODES.UNKNOWN_ACTION,
        { availableCommands: Object.keys(this.commands) }
      );
    }
    return command();
  }

  executeStart() {
    this.timer.stateManager.transition('start');
    this.timer.startCounting();
    this.timer.messagePort.send('start');
  }

  executeStop() {
    this.timer.stateManager.transition('stop');
    this.timer.cleanup();
    this.timer.messagePort.send('stop', {
      secondsElapsed: this.timer.secondsElapsed,
    });
  }

  executePause() {
    this.timer.stateManager.transition('pause');
    this.timer.stopCounting();
    this.timer.messagePort.send('pause', {
      secondsElapsed: this.timer.secondsElapsed,
    });
  }

  executeResume() {
    this.timer.stateManager.transition('resume');
    this.timer.startCounting();
    this.timer.messagePort.send('resume', {
      secondsElapsed: this.timer.secondsElapsed,
    });
  }

  executeGetElapsed() {
    this.timer.messagePort.send('getElapsed', {
      secondsElapsed: this.timer.secondsElapsed,
      state: this.timer.stateManager.getState(),
    });
  }
}

// Main Timer Class
class Timer {
  constructor(messagePort, timeProvider, errorHandler) {
    this.messagePort = messagePort;
    this.timeProvider = timeProvider;
    this.errorHandler = errorHandler;
    this.secondsElapsed = 0;
    this.intervalId = null;
    this.stateManager = new StateManager(this);
    this.commandExecutor = new TimerCommandExecutor(this);

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    try {
      this.messagePort.onMessage(this.handleMessage.bind(this));
      this.messagePort.onClose(this.cleanup.bind(this));

      process.on('uncaughtException', (error) => {
        this.errorHandler.handle(error);
        this.cleanup();
      });
    } catch (error) {
      this.errorHandler.handle(
        new TimerError(
          'Failed to setup event handlers',
          ERROR_CODES.COMMAND_ERROR,
          { originalError: error.message }
        )
      );
    }
  }

  handleMessage(message) {
    try {
      const { action } = message;

      if (!action) {
        throw new TimerError(
          'Invalid message format: missing action',
          ERROR_CODES.COMMAND_ERROR,
          { receivedMessage: message }
        );
      }

      this.commandExecutor.execute(action);
    } catch (error) {
      this.errorHandler.handle(error);
    }
  }

  startCounting() {
    try {
      this.stopCounting();
      this.intervalId = this.timeProvider.getInterval(() => {
        this.secondsElapsed++;
        this.messagePort.send('tick', {
          secondsElapsed: this.secondsElapsed,
          state: this.stateManager.getState(),
        });
      }, 1000);
    } catch (error) {
      this.errorHandler.handle(
        new TimerError('Failed to start counting', ERROR_CODES.COMMAND_ERROR, {
          originalError: error.message,
        })
      );
    }
  }

  stopCounting() {
    try {
      if (this.intervalId) {
        this.timeProvider.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    } catch (error) {
      this.errorHandler.handle(
        new TimerError('Failed to stop counting', ERROR_CODES.COMMAND_ERROR, {
          originalError: error.message,
        })
      );
    }
  }

  cleanup() {
    try {
      this.stopCounting();
      this.messagePort.send('cleanup', {
        finalState: this.stateManager.getState(),
        secondsElapsed: this.secondsElapsed,
      });
    } catch (error) {
      this.errorHandler.handle(
        new TimerError('Failed to cleanup timer', ERROR_CODES.COMMAND_ERROR, {
          originalError: error.message,
        })
      );
    }
  }
}

// Timer Factory with validation
class TimerFactory {
  static create(parentPort) {
    if (!parentPort) {
      throw new TimerError(
        'Parent port is required',
        ERROR_CODES.COMMAND_ERROR,
        { component: 'TimerFactory' }
      );
    }

    try {
      const messagePort = new MessagePortAdapter(parentPort);
      const timeProvider = new NodeTimeProvider();
      const errorHandler = new WorkerErrorHandler(messagePort);

      return new Timer(messagePort, timeProvider, errorHandler);
    } catch (error) {
      console.error('Failed to create timer:', error);
      throw new TimerError(
        'Failed to create timer instance',
        ERROR_CODES.COMMAND_ERROR,
        { originalError: error.message }
      );
    }
  }
}

// Initialize worker with error handling
try {
  TimerFactory.create(parentPort);
} catch (error) {
  console.error('Failed to initialize worker:', error);
  process.exit(1);
}
