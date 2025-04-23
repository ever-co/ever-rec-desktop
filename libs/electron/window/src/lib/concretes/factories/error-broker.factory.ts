import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  MessageType,
} from '@ever-co/shared-utils';
import { MessageBrokerFactory } from '../../abstracts/message-broker-factory';
import { ErrorMessageBroker } from '../brokers/error.broker';

export class ErrorMessageBrokerFactory extends MessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.ERROR;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker | undefined {
    if (!this.canHandle(message)) {
      return this.getNext()?.createMessageBroker(message, sourceId);
    }
    return new ErrorMessageBroker(message, sourceId);
  }
}
