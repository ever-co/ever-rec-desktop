import { AppWindowId } from '../enums/app-window-id.enum';
import { IWindow } from './window.interface';

export interface IWindowManager {
  register(id: AppWindowId, window: IWindow): void;

  unregister(id: AppWindowId): void;

  show(id: AppWindowId): void;

  hide(id: AppWindowId): void;

  getOne(id: AppWindowId): IWindow | null;
}
