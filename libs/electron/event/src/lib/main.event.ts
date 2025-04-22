import { KeytarService } from '@ever-co/electron-utils';
import { Channel, MediatorIncomingMessage } from '@ever-co/shared-utils';
import {
  WindowStateMediator,
  DefaultMessageBrokerFactory,
  NotificationMessageBrokerFactory,
  ErrorMessageBrokerFactory,
  StateSyncMessageBrokerFactory,
} from '@ever-co/window';
import { app, ipcMain } from 'electron';

export function MainEvents() {
  ipcMain.on(Channel.UPDATE_ICON_BADGE, (_, count: number) => {
    app.setBadgeCount(Math.max(count, 0));
  });

  ipcMain.handle(Channel.GET_PASSWORD, (_, account: string) => {
    return KeytarService.getPassword(account);
  });

  ipcMain.handle(Channel.DELETE_PASSWORD, (_, account: string) => {
    return KeytarService.deletePassword(account);
  });

  ipcMain.handle(
    Channel.SET_PASSWORD,
    (_, { account, password }: { account: string; password: string }) => {
      return KeytarService.setPassword(account, password);
    }
  );

  app.on('ready', () => {
    const mediator = WindowStateMediator.getInstance();
    mediator.registerMessageBroker(new DefaultMessageBrokerFactory());
    mediator.registerMessageBroker(new NotificationMessageBrokerFactory());
    mediator.registerMessageBroker(new ErrorMessageBrokerFactory());
    mediator.registerMessageBroker(new StateSyncMessageBrokerFactory());
  });

  ipcMain.on(
    Channel.MEDIATOR_INCOMING_MESSAGE,
    (_, { sourceId, message }: MediatorIncomingMessage) => {
      const mediator = WindowStateMediator.getInstance();
      mediator.handleIncomingMessage(sourceId, message);
    }
  );
}

export function removeMainEvents(): void {
  ipcMain.removeAllListeners(Channel.UPDATE_ICON_BADGE);

  [Channel.GET_PASSWORD, Channel.DELETE_PASSWORD, Channel.SET_PASSWORD].forEach(
    (channel) => ipcMain.removeHandler(channel)
  );
}
