// Dependencies
const { parentPort } = require('worker_threads');

// Constants
const ERROR_CODES = Object.freeze({
  INVALID_STATE: 'INVALID_STATE',
  INVALID_TRANSITION: 'INVALID_TRANSITION',
  COMMAND_ERROR: 'COMMAND_ERROR',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
});

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

// Base State Class
class TimerState {
  constructor(context) {
    this.context = context;
  }

  enter() {
    // No-op
  }
  exit() {
    // No-op
  }
  handleAction() {
    // No-op
  }
  getStateName() {
    // No-op
  }

  validateTransition(action) {
    const validTransitions = this.getValidTransitions();
    if (!validTransitions.includes(action)) {
      throw new TimerError(
        `Invalid transition: ${action} from ${this.getStateName()}`,
        ERROR_CODES.INVALID_TRANSITION
      );
    }
  }
}

// Concrete States
class StoppedState extends TimerState {
  getStateName() {
    return 'STOPPED';
  }

  enter() {
    this.context.cleanup();
    this.context.notifyStateChange('stop');
  }

  exit() {
    this.context.resetElapsedTime();
  }

  handleAction(action) {
    this.validateTransition(action);
    if (action === 'start') {
      this.context.transitionTo(new RunningState(this.context));
    }
  }

  getValidTransitions() {
    return ['start'];
  }
}

class RunningState extends TimerState {
  getStateName() {
    return 'RUNNING';
  }

  enter() {
    this.context.startCounting();
    if (this.context.isQuietTransition) return;
    this.context.notifyStateChange('start');
  }

  exit() {
    this.context.stopCounting();
  }

  handleAction(action) {
    this.validateTransition(action);
    switch (action) {
      case 'pause':
        this.context.transitionTo(new PausedState(this.context));
        break;
      case 'stop':
        this.context.transitionTo(new StoppedState(this.context));
        break;
    }
  }

  getValidTransitions() {
    return ['pause', 'stop'];
  }
}

class ResumeState extends TimerState {
  getStateName() {
    return 'RESUMING';
  }

  enter() {
    this.context.notifyStateChange('resume');
    this.context.transitionTo(new RunningState(this.context), true);
  }

  exit() {
    // No-op
  }

  handleAction(action) {
    this.validateTransition(action);
    switch (action) {
      case 'pause':
        this.context.transitionTo(new PausedState(this.context));
        break;
      case 'stop':
        this.context.transitionTo(new StoppedState(this.context));
        break;
    }
  }

  getValidTransitions() {
    return ['pause', 'stop'];
  }
}

class PausedState extends TimerState {
  getStateName() {
    return 'PAUSED';
  }

  enter() {
    this.context.notifyStateChange('pause');
  }

  exit() {
    // No-op
  }

  handleAction(action) {
    this.validateTransition(action);
    switch (action) {
      case 'resume':
        this.context.transitionTo(new ResumeState(this.context));
        break;
      case 'stop':
        this.context.transitionTo(new StoppedState(this.context));
        break;
    }
  }

  getValidTransitions() {
    return ['resume', 'stop'];
  }
}

// Context Class
class TimerContext {
  constructor(messagePort, timeProvider) {
    this.messagePort = messagePort;
    this.timeProvider = timeProvider;
    this.state = new StoppedState(this);
    this.secondsElapsed = 0;
    this.intervalId = null;
    this.isQuietTransition = false;
  }

  transitionTo(newState, isQuiet = false) {
    this.isQuietTransition = isQuiet;
    this.state?.exit();
    this.state = newState;
    this.state.enter();
    this.isQuietTransition = false;
  }

  handleAction(action) {
    this.state.handleAction(action);
  }

  startCounting() {
    this.stopCounting();
    this.intervalId = this.timeProvider.getInterval(() => {
      this.secondsElapsed++;
      this.notifyTick();
    }, 1000);
  }

  stopCounting() {
    if (this.intervalId) {
      this.timeProvider.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  cleanup() {
    this.stopCounting();
    this.messagePort.send('cleanup', {
      finalState: this.state.getStateName(),
      secondsElapsed: this.secondsElapsed,
    });
  }

  resetElapsedTime() {
    this.secondsElapsed = 0;
  }

  notifyStateChange(action) {
    this.messagePort.send(action, {
      secondsElapsed: this.secondsElapsed,
      state: this.state.getStateName(),
    });
  }

  notifyTick() {
    this.messagePort.send('tick', {
      secondsElapsed: this.secondsElapsed,
      state: this.state.getStateName(),
    });
  }

  getElapsedTime() {
    return this.secondsElapsed;
  }
}

// Provider Implementations
class NodeTimeProvider {
  getInterval(callback, delay) {
    if (typeof callback !== 'function') {
      throw new TimerError('Invalid callback', ERROR_CODES.COMMAND_ERROR);
    }
    return setInterval(callback, delay);
  }

  clearInterval(id) {
    if (id) clearInterval(id);
  }
}

class MessagePortAdapter {
  constructor(port) {
    if (!port) {
      throw new TimerError('Invalid message port', ERROR_CODES.COMMAND_ERROR);
    }
    this.port = port;
  }

  send(action, data = {}) {
    if (!action) {
      throw new TimerError('Invalid action', ERROR_CODES.COMMAND_ERROR);
    }
    this.port.postMessage({ action, ...data });
  }

  onMessage(callback) {
    if (typeof callback !== 'function') {
      throw new TimerError('Invalid callback', ERROR_CODES.COMMAND_ERROR);
    }
    this.port.on('message', callback);
  }

  onClose(callback) {
    if (typeof callback !== 'function') {
      throw new TimerError('Invalid callback', ERROR_CODES.COMMAND_ERROR);
    }
    this.port.on('close', callback);
  }
}

// Error Handler
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

// Command Pattern
class Command {
  constructor(context) {
    this.context = context;
  }

  execute() {
    throw new Error('Command must implement execute method');
  }
}

class StateTransitionCommand extends Command {
  constructor(action, context) {
    super(context);
    this.action = action;
  }

  execute() {
    this.context.handleAction(this.action);
  }
}

class GetElapsedCommand extends Command {
  execute() {
    const elapsed = this.context.getElapsedTime();
    this.context.messagePort.send('getElapsed', {
      secondsElapsed: elapsed,
      state: this.context.state.getStateName(),
    });
  }
}

// Command Factory
class CommandFactory {
  static createCommand(action, context) {
    switch (action) {
      case 'start':
      case 'stop':
      case 'pause':
      case 'resume':
        return new StateTransitionCommand(action, context);
      case 'getElapsed':
        return new GetElapsedCommand(context);
      default:
        throw new TimerError(
          `Unknown command: ${action}`,
          ERROR_CODES.UNKNOWN_ACTION
        );
    }
  }
}

// Timer Factory
class TimerFactory {
  static create(parentPort) {
    if (!parentPort) {
      throw new TimerError(
        'Parent port is required',
        ERROR_CODES.COMMAND_ERROR
      );
    }

    const messagePort = new MessagePortAdapter(parentPort);
    const timeProvider = new NodeTimeProvider();
    const errorHandler = new WorkerErrorHandler(messagePort);
    const context = new TimerContext(messagePort, timeProvider);

    // Setup message handling
    messagePort.onMessage((message) => {
      try {
        if (!message?.action) {
          throw new TimerError(
            'Invalid message format',
            ERROR_CODES.COMMAND_ERROR
          );
        }

        const command = CommandFactory.createCommand(message.action, context);
        command.execute();
      } catch (error) {
        errorHandler.handle(error);
      }
    });

    messagePort.onClose(() => {
      context.cleanup();
    });

    // Setup process error handling
    process.on('uncaughtException', (error) => {
      errorHandler.handle(error);
      context.cleanup();
    });

    return context;
  }
}

// Initialize worker
try {
  TimerFactory.create(parentPort);
} catch (error) {
  console.error('Failed to initialize worker:', error);
  process.exit(1);
}
