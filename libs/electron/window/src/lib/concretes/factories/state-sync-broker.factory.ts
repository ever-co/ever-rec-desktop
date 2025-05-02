import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  isEmpty,
  MessageType,
} from '@ever-co/shared-utils';
import { MessageBrokerFactory } from '../../abstracts/message-broker-factory';
import { StateSyncMessageBroker } from '../brokers/state-sync.broker';

export class StateSyncMessageBrokerFactory extends MessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    if (isEmpty(message)) return false;
    return message.type === MessageType.STATE_SYNC;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker | undefined {
    if (!this.canHandle(message)) {
      return this.getNext()?.createMessageBroker(message, sourceId);
    }
    return new StateSyncMessageBroker(message, sourceId);
  }
}
