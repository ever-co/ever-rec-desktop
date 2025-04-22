import {
  AppWindowId,
  IMessage,
  IMessageBroker,
  IMessageBrokerFactory,
  MessageType,
} from '@ever-co/shared-utils';
import { ErrorMessageBroker } from '../brokers/error.broker';

export class ErrorMessageBrokerFactory implements IMessageBrokerFactory {
  public canHandle(message: IMessage): boolean {
    return message.type === MessageType.ERROR;
  }

  public createMessageBroker(
    message: IMessage,
    sourceId: AppWindowId
  ): IMessageBroker {
    return new ErrorMessageBroker(message, sourceId);
  }
}
