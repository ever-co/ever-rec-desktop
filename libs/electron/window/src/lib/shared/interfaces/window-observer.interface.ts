export interface IWindowObserver {
  onRegistered(windowId: string): void;
  onClosed(windowId: string): void;
}
