import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  IMessageBrokerFactory,
  MessageType,
} from '@ever-co/shared-utils';
import { NotificationMessageBroker } from '../brokers/notification.broker';

export class NotificationMessageBrokerFactory implements IMessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.NOTIFICATION;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker {
    return new NotificationMessageBroker(message, sourceId);
  }
}
