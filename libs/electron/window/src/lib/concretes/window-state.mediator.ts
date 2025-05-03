import {
  AppWindowId,
  Channel,
  IMessage,
  IMessageBrokerFactory,
} from '@ever-co/shared-utils';
import { IWindowManager } from '../shared/interfaces/window-manager.interface';
import { IWindow } from '../shared/interfaces/window.interface';
import { StateSyncMessageBrokerFactory } from './factories/state-sync-broker.factory';
import { MessageBrokerDispatcher } from './message.dispatcher';
import { WindowManager } from './window.manager';

export class WindowStateMediator {
  private static instance: WindowStateMediator;
  private readonly manager: IWindowManager = WindowManager.getInstance();
  private readonly dispatcher: MessageBrokerDispatcher;

  private constructor() {
    this.dispatcher = new MessageBrokerDispatcher();
    this.dispatcher.register(new StateSyncMessageBrokerFactory());
  }

  public static getInstance(): WindowStateMediator {
    if (!WindowStateMediator.instance) {
      WindowStateMediator.instance = new WindowStateMediator();
    }
    return WindowStateMediator.instance;
  }

  public registerMessageBroker(factory: IMessageBrokerFactory): void {
    this.dispatcher.register(factory);
  }

  public clearAllBrokers(): void {
    this.dispatcher.clear();
  }

  public handleIncomingMessage(sourceId: AppWindowId, message: IMessage): void {
    this.dispatcher.dispatch(message, sourceId);
  }

  public broadcast(message: IMessage, excludeWindowId?: AppWindowId): void {
    this.windows.forEach((window, windowId) => {
      if (
        windowId !== excludeWindowId &&
        !window.browserWindow?.isDestroyed()
      ) {
        window.send(Channel.MEDIATOR_OUTGOING_MESSAGE, message);
      }
    });
  }

  private get windows(): Map<AppWindowId, IWindow> {
    return this.manager.getAll();
  }
}
