import {
  AppWindowId,
  IMessage,
  IMessageBrokerFactory,
} from '@ever-co/shared-utils';

export class MessageBrokerDispatcher {
  constructor(private readonly factories: IMessageBrokerFactory[]) {}

  public dispatch(message: IMessage, sourceId: AppWindowId): void {
    for (const factory of this.factories) {
      if (factory.canHandle(message)) {
        const messageBroker = factory.createMessageBroker(message, sourceId);
        messageBroker.handle();
        return;
      }
    }

    console.warn(`Unhandled message type: ${message.type}`);
  }
}
