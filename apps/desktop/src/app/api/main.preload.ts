import { Channel, isHttpUrl } from '@ever-co/shared-utils';
import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron';

type IpcCallback = (event: IpcRendererEvent, ...args: any[]) => void;

const validChannels = Object.values(Channel); // Replace with your actual channels

ipcRenderer.setMaxListeners(0);

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => {
    if (isHttpUrl(url)) {
      shell.openExternal(url);
    } else {
      console.warn(`Blocked attempt to open unsafe URL: ${url}`);
    }
  },
  invoke: (channel: Channel, data?: any): Promise<any> => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    } else {
      throw new Error(`Invalid channel: ${channel}`);
    }
  },
  on: (channel: Channel, callback: IpcCallback): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  once: (channel: Channel, callback: IpcCallback): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, callback);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  send: (channel: Channel, data?: any): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  removeAllListeners: (channel: Channel): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
  removeListener: (channel: Channel, callback: IpcCallback): void => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    } else {
      console.error(`Invalid channel: ${channel}`);
    }
  },
});
