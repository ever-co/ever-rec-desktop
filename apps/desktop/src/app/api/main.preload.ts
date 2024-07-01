import { channel } from '@prototype/shared/utils';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  captureScreen: (delay: number) =>
    ipcRenderer.send(channel.CAPTURE_SCREEN, delay),
  onScreenshotCaptured: (callback) =>
    ipcRenderer.on(channel.SCREENSHOT_CAPTURED, callback),
  platform: process.platform,
});
