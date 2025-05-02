import { AppWindowId } from '@ever-co/shared-utils';
import { IWindow } from './window.interface';

export interface IWindowManager {
  register(id: AppWindowId, window: IWindow): void;

  unregister(id: AppWindowId): void;

  show(id: AppWindowId): void;

  hide(id: AppWindowId): void;

  getOne(id: AppWindowId): IWindow | null;

  getAll(): Map<AppWindowId, IWindow>;
}
