import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  isEmpty,
  MessageType,
} from '@ever-co/shared-utils';
import { MessageBrokerFactory } from '../../abstracts/message-broker-factory';
import { DefaultMessageBroker } from '../brokers/default.broker';

export class DefaultMessageBrokerFactory extends MessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    if (isEmpty(message)) return false;
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
