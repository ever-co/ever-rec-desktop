import {
  AppWindowId,
  IMessage,
  IMessageBrokerFactory,
  isEmpty,
} from '@ever-co/shared-utils';

/**
 * MessageBrokerDispatcher constructs a chain of message broker factories
 * and delegates message handling to the appropriate broker.
 */
export class MessageBrokerDispatcher {
  private head?: IMessageBrokerFactory;
  private factories: IMessageBrokerFactory[];

  constructor(factories: IMessageBrokerFactory[] = []) {
    this.factories = [];
    this.register(...factories);
  }

  /**
   * Registers new message broker factories.
   */
  public register(...factories: IMessageBrokerFactory[]): void {
    if (factories.length === 0) return;
    // Check for duplicated factories
    for (const factory of factories) {
      if (!this.factories.includes(factory)) {
        this.factories.push(factory);
      }
    }
    // Rebuild the chain
    this.head = this.buildChain(this.factories);
  }

  /**
   * Clears all registered message broker factories.
   */
  public clear(): void {
    this.factories = [];
    this.head = undefined;
  }

  /**
   * Builds a chain of responsibility from the given factories.
   */
  private buildChain(
    factories: IMessageBrokerFactory[]
  ): IMessageBrokerFactory | undefined {
    if (factories.length === 0) return undefined;

    // Link each factory to the next one
    for (let i = 0; i < factories.length - 1; i++) {
      factories[i].setNext(factories[i + 1]);
    }

    return factories[0];
  }

  /**
   * Dispatches a message to the appropriate message broker.
   * @throws Error if no factories are registered
   */
  public dispatch(message: IMessage, sourceId: AppWindowId): void {
    if (!this.head) {
      throw new Error('No message broker factories registered');
    }

    if (isEmpty(message)) {
      throw new Error('Cannot dispatch empty message');
    }

    const broker = this.head.createMessageBroker(message, sourceId);

    if (!broker) {
      console.warn(
        `No broker found to handle message of type ${message.type} from ${sourceId}`,
        message
      );
      return;
    }

    try {
      broker.handle();
    } catch (error) {
      console.error(`Error handling message from ${sourceId}:`, error);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }
}
