
import { Injectable, inject, NgZone, DOCUMENT } from '@angular/core';
import { Channel } from '@ever-co/shared-utils';
import { Observable, from, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);

  /**
   * Safely access the window object with null checks
   */
  private get window(): Window | null {
    return this.document.defaultView;
  }

  /**
   * Get the electronAPI with proper type safety and null checks
   */
  private get electronAPI(): ElectronAPI | null {
    if (!this.window) {
      console.warn('[ElectronService]: Window is not available');
      return null;
    }

    if (!('electronAPI' in this.window)) {
      console.warn('[ElectronService]: Electron API is not available');
      return null;
    }

    return this.window.electronAPI as ElectronAPI;
  }

  /**
   * Check if Electron API is available
   */
  public get isElectron(): boolean {
    return !!this.electronAPI;
  }

  /**
   * Invoke an Electron IPC handler with type-safe arguments and return value
   */
  public invoke<T = unknown, U = unknown>(
    channel: Channel,
    data?: T,
  ): Promise<U> {
    if (!this.isElectron) {
      return Promise.reject(new Error('Electron API is not available'));
    }

    return this.electronAPI!.invoke(channel, data);
  }

  /**
   * Observable-based version of invoke
   */
  public invoke$<T = unknown, U = unknown>(
    channel: Channel,
    data?: T,
  ): Observable<U> {
    if (!this.isElectron) {
      return throwError(() => new Error('Electron API is not available'));
    }

    return from(this.invoke<T, U>(channel, data));
  }

  /**
   * Listen to an Electron IPC channel with proper Angular zone awareness
   */
  public on(channel: Channel, callback: (...args: any[]) => void): () => void {
    if (!this.isElectron) {
      throw new Error('Electron API is not available');
    }

    const handler = (...args: any[]) => {
      this.ngZone.run(() => callback(...args));
    };

    this.electronAPI!.on(channel, handler);

    // Return cleanup function
    return () => this.removeListener(channel, handler);
  }

  /**
   * Create an Observable from an Electron IPC channel
   */
  public fromEvent<T>(channel: Channel): Observable<T> {
    return new Observable((subscriber) => {
      if (!this.isElectron) {
        subscriber.error(new Error('Electron API is not available'));
        return;
      }

      const handler = (_: Electron.IpcMainEvent, ...args: any[]) => {
        this.ngZone.run(() => {
          if (args.length === 1) {
            subscriber.next(args[0]);
          } else {
            subscriber.next(args as T);
          }
        });
      };

      this.electronAPI!.on(channel, handler);

      // Cleanup function
      return () => this.removeListener(channel, handler);
    });
  }

  /**
   * Listen to an Electron IPC channel once
   */
  public once(channel: Channel, callback: (...args: any[]) => void): void {
    if (!this.isElectron) {
      throw new Error('Electron API is not available');
    }

    const handler = (...args: any[]) => {
      this.ngZone.run(() => callback(...args));
    };

    this.electronAPI!.once(channel, handler);
  }

  /**
   * Send data to the main process via IPC
   */
  public send(channel: Channel, data?: any): void {
    if (!this.isElectron) {
      throw new Error('Electron API is not available');
    }

    this.electronAPI!.send(channel, data);
  }

  /**
   * Remove all listeners for a channel
   */
  public removeAllListeners(channel: Channel): void {
    if (!this.isElectron) {
      return;
    }

    this.electronAPI!.removeAllListeners(channel);
  }

  /**
   * Remove a specific listener for a channel
   */
  public removeListener(
    channel: Channel,
    callback: (...args: any[]) => void,
  ): void {
    if (!this.isElectron) {
      return;
    }

    this.electronAPI!.removeListener(channel, callback);
  }
  /**
   * Open url link
   */
  public async openExternal(url: string): Promise<void> {
    console.log(url);
    await this.electronAPI!.openExternal(url);
    console.log('Done');
  }

  public openExternal$(url: string): Observable<void> {
    return from(this.openExternal(url));
  }
}

// Type definitions for better type safety
interface ElectronAPI {
  invoke: <T, U>(channel: string, data?: T) => Promise<U>;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  once: (channel: string, callback: (...args: any[]) => void) => void;
  send: (channel: string, data?: any) => void;
  removeAllListeners: (channel: string) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
  openExternal: (string: string) => Promise<void>;
}
