// electronAPI.d.ts
import { IpcRendererEvent } from 'electron';

// Type for the callback used in IPC listeners
type IpcCallback = (event: IpcRendererEvent, ...args: any[]) => void;

interface ElectronAPI {
  /**
   * Opens an external URL in the default browser.
   * @param url The URL to open.
   * @returns void
   */
  openExternal: (url: string) => void;

  /**
   * Invokes a channel with the specified data and returns a promise.
   * @param channel The channel to invoke.
   * @param data The data to send with the invocation.
   * @returns A promise that resolves with the result of the invocation.
   */
  invoke(channel: string, data?: any): Promise<any>;

  /**
   * Adds a listener for the specified channel.
   * @param channel The channel to listen on.
   * @param callback The callback to invoke when a message is received.
   */
  on(channel: string, callback: IpcCallback): void;

  /**
   * Adds a one-time listener for the specified channel.
   * @param channel The channel to listen on.
   * @param callback The callback to invoke when a message is received.
   */
  once(channel: string, callback: IpcCallback): void;

  /**
   * Sends a message to the specified channel.
   * @param channel The channel to send to.
   * @param data The data to send with the message.
   */
  send(channel: string, data?: any): void;

  /**
   * Removes all listeners for the specified channel.
   * @param channel The channel to remove listeners from.
   */
  removeAllListeners(channel: string): void;

  /**
   * Removes a specific listener for the specified channel.
   * @param channel The channel to remove the listener from.
   * @param callback The callback to remove.
   */
  removeListener(channel: string, callback: IpcCallback): void;
}

export {};

// Declare the interface for the global context
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
