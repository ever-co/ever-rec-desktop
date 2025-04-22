import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  IMessageBrokerFactory,
  MessageType,
} from '@ever-co/shared-utils';
import { StateSyncMessageBroker } from '../brokers/state-sync.broker';

export class StateSyncMessageBrokerFactory implements IMessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.STATE_SYNC;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker {
    return new StateSyncMessageBroker(message, sourceId);
  }
}
