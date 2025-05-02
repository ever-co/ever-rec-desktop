import { AppWindowId } from '../app-window-id.enum';
import { IMessage } from './message-broker.interface';

export interface MediatorIncomingMessage {
  message: IMessage;
  sourceId: AppWindowId;
}

export type MediatorOutgoingMessage = IMessage;
