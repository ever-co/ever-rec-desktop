import { AppWindowId } from '../app-window-id.enum';
import { MessageType } from '../message-type.enum';

export interface IMessage {
  type: MessageType;
  payload: any;
  metadata: {
    timestamp: number;
    source: string;
    processed?: boolean;
  };
}

export interface IMessageBroker {
  handle(): void;
}

export interface IMessageBrokerFactory {
  canHandle(message: IMessage): boolean;
  createMessageBroker(message: IMessage, sourceId: AppWindowId): IMessageBroker;
}
