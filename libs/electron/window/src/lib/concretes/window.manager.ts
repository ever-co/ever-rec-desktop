import { ElectronLogger } from '@ever-co/electron-utils';
import { AppWindowId, ILoggable } from '@ever-co/shared-utils';
import { IWindowManager } from '../shared/interfaces/window-manager.interface';
import { IWindow } from '../shared/interfaces/window.interface';
import { IWindowObserver } from '../shared/interfaces/window-observer.interface';

export class WindowManager implements IWindowManager, ILoggable {
  readonly logger = new ElectronLogger('WindowManager');
  private static instance: WindowManager | null = null;
  private windows: Map<AppWindowId, IWindow> = new Map();
  private observers: IWindowObserver[] = [];

  /**
   * Retrieves the singleton instance of WindowManager.
   * Creates a new instance if none exists.
   */
  public static getInstance(): IWindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  /**
   * Registers an observer for window events.
   * @param observer - The observer to register.
   * @returns void
   * @throws Error if the observer is already registered.
   */
  public registerObserver(observer: IWindowObserver): void {
    if (this.observers.includes(observer)) {
      this.logger.warn(`Observer "${observer}" is already registered.`);
      return;
    }

    this.observers.push(observer);
  }

  /**
   * Notifies all registered observers about a window event.
   * @param event - The event type ('registered' or 'closed').
   * @param windowId - The id of the window that triggered the event.
   * @returns void
   */
  private notifyObservers(
    event: 'registered' | 'closed',
    windowId: string
  ): void {
    this.observers.forEach((observer) => {
      if (event === 'registered') {
        observer.onRegistered(windowId);
      } else {
        observer.onClosed(windowId);
      }
    });
  }

  /**
   * Registers a new window with the given id.
   * @param id - The unique id for the window.
   * @param window - The window instance to register.
   */
  public register(id: AppWindowId, window: IWindow): void {
    if (this.windows.has(id)) {
      this.logger.warn(`Window with id "${id}" already exists.`);
      return;
    }
    this.windows.set(id, window);
    this.logger.info(`Window with id "${id}" registered successfully.`);
    this.notifyObservers('registered', id);
  }

  /**
   * Unregisters a window by its id.
   * @param id - The unique id of the window to unregister.
   * @returns `true` if the window was successfully unregistered; otherwise, `false`.
   */
  public unregister(id: AppWindowId): boolean {
    const removed = this.windows.delete(id);
    if (removed) {
      this.logger.info(`Window with id "${id}" unregistered successfully.`);
      this.notifyObservers('closed', id);
    } else {
      this.logger.warn(`Window with id "${id}" does not exist.`);
    }
    return removed;
  }

  /**
   * Displays the window with the given id.
   * @param id - The unique id of the window to show.
   * @throws Error if the window does not exist.
   */
  public show(id: AppWindowId): void {
    const window = this.windows.get(id);
    if (!window) {
      this.logger.error(`Cannot show. Window with id "${id}" not found.`);
      throw new Error(`Window "${id}" not found.`);
    }
    window.show();
    this.logger.info(`Window with id "${id}" is now visible.`);
  }

  /**
   * Hides the window with the given id.
   * @param id - The unique id of the window to hide.
   * @throws Error if the window does not exist.
   */
  public hide(id: AppWindowId): void {
    const window = this.windows.get(id);
    if (!window) {
      this.logger.error(`Cannot hide. Window with id "${id}" not found.`);
      return;
    }
    window.hide();
    this.logger.info(`Window with id "${id}" is now hidden.`);
  }

  /**
   * Retrieves a single window by its id.
   * @param id - The unique id of the window to retrieve.
   * @returns The window instance if found, or `null` if not found.
   */
  public getOne(id: AppWindowId): IWindow | null {
    const window = this.windows.get(id);
    if (!window) {
      this.logger.warn(`Window with id "${id}" not found.`);
      return null;
    }
    return window;
  }

  public getAll(): Map<AppWindowId, IWindow> {
    if (this.windows.size === 0) {
      this.logger.warn('No windows found.');
      return new Map([]);
    }
    this.logger.info('Getting all windows.');
    return this.windows;
  }
}
