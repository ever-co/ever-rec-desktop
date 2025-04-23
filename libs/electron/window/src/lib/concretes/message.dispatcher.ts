import {
  AppWindowId,
  IMessage,
  IMessageBrokerFactory,
} from '@ever-co/shared-utils';

/**
 * MessageBrokerDispatcher constructs a chain of message broker factories
 * and delegates message handling to the appropriate broker.
 */
export class MessageBrokerDispatcher {
  private factory?: IMessageBrokerFactory;
  private factories: IMessageBrokerFactory[];

  constructor() {
    this.factories = [];
  }

  /**
   * Registers a new message broker factory.
   */
  public register(...factories: IMessageBrokerFactory[]): void {
    this.factories = [...this.factories, ...factories];
    this.factory = this.buildChain(this.factories);
  }

  /**
   * Builds a chain of responsibility from the given factories.
   */
  private buildChain(
    factories: IMessageBrokerFactory[]
  ): IMessageBrokerFactory {
    return factories.reduce((chain, current) => chain.setNext(current));
  }

  /**
   * Dispatches a message to the appropriate message broker.
   */
  public dispatch(message: IMessage, sourceId: AppWindowId): void {
    const broker = this.factory?.createMessageBroker(message, sourceId);

    if (!broker) {
      console.warn(
        `No broker found to handle message from ${sourceId}`,
        message
      );
      return;
    }

    broker.handle();
  }
}
