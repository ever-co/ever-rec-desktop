import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  MessageType,
} from '@ever-co/shared-utils';
import { MessageBrokerFactory } from '../../abstracts/message-broker-factory';
import { NotificationMessageBroker } from '../brokers/notification.broker';

export class NotificationMessageBrokerFactory extends MessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.NOTIFICATION;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker | undefined {
    if (!this.canHandle(message)) {
      return this.getNext()?.createMessageBroker(message, sourceId);
    }
    return new NotificationMessageBroker(message, sourceId);
  }
}
