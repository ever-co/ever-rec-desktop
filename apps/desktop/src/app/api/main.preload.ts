import { channel } from '@prototype/shared/utils';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  stopCapture: () => ipcRenderer.send(channel.STOP_CAPTURE_SCREEN),
  startCapture: (delay: number) =>
    ipcRenderer.send(channel.START_CAPTURE_SCREEN, delay),
  onScreenshotCaptured: (callback) =>
    ipcRenderer.on(channel.SCREENSHOT_CAPTURED, callback),
  platform: process.platform,
});
