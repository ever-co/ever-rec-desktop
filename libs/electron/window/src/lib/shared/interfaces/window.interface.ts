import { Channel } from '@ever-co/shared-utils';
import { IWindowConfig } from './window-config.interface';
import { BrowserWindow } from 'electron';

export interface IWindow {
  load(): Promise<void>;
  show(): void;
  hide(): void;
  close(): void;
  minimize(): void;
  maximize(): void;
  restore(): void;
  focus(): void;
  setSkipTaskbar(skip: boolean): void;
  isMinimized(): boolean;
  requestHide(): void;
  requestClose(): void;
  requestMinimize(): void;
  initiateGracefulExit(): Promise<void>;
  isDestroyed(): boolean;
  readonly isAppExiting: boolean;
  readonly config: IWindowConfig;
  get browserWindow(): BrowserWindow | undefined;
  send(channel: Channel, ...args: any[]): void;
}
