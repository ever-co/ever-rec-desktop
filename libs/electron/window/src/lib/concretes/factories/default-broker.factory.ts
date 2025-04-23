import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  MessageType,
} from '@ever-co/shared-utils';
import { MessageBrokerFactory } from '../../abstracts/message-broker-factory';
import { DefaultMessageBroker } from '../brokers/default.broker';

export class DefaultMessageBrokerFactory extends MessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.DEFAULT;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker | undefined {
    if (!this.canHandle(message)) {
      return this.getNext()?.createMessageBroker(message, sourceId);
    }
    return new DefaultMessageBroker(message, sourceId);
  }
}
