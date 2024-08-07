import { Channel as ChEnum } from '@prototype/shared/utils';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type IpcCallback = (event: IpcRendererEvent, ...args: any[]) => void;

const validChannels = Object.values(ChEnum); // Replace with your actual channels

ipcRenderer.setMaxListeners(0);

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: ChEnum, data?: any): Promise<any> => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    } else {
      throw new Error(`Invalid channel: ${channel}`);
    }
  },
  on: (channel: ChEnum, callback: IpcCallback): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  once: (channel: ChEnum, callback: IpcCallback): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, callback);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  send: (channel: ChEnum, data?: any): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  removeAllListeners: (channel: ChEnum): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  removeListener: (channel: ChEnum, callback: IpcCallback): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
});
