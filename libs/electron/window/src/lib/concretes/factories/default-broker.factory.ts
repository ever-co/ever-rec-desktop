import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  IMessageBrokerFactory,
  MessageType,
} from '@ever-co/shared-utils';
import { DefaultMessageBroker } from '../brokers/default.broker';

export class DefaultMessageBrokerFactory implements IMessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.DEFAULT;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker {
    return new DefaultMessageBroker(message, sourceId);
  }
}
