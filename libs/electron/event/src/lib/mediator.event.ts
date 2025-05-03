import {
  Channel,
  isEmpty,
  MediatorIncomingMessage,
} from '@ever-co/shared-utils';
import { WindowStateMediator } from '@ever-co/window';
import { ipcMain } from 'electron';

const mediator = WindowStateMediator.getInstance();

export function mediatorEvents(): void {
  ipcMain.on(
    Channel.MEDIATOR_INCOMING_MESSAGE,
    (_, incomingMessage: MediatorIncomingMessage) => {
      if (isEmpty(incomingMessage)) {
        return;
      }
      const { sourceId, message } = incomingMessage;
      mediator.handleIncomingMessage(sourceId, message);
    }
  );
}

export function removeMediatorEvents(): void {
  [
    Channel.MEDIATOR_INCOMING_MESSAGE,
    Channel.MEDIATOR_OUTGOING_MESSAGE,
  ].forEach((channel) => ipcMain.removeAllListeners(channel));
}
