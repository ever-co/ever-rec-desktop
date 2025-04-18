import { BrowserWindowConstructorOptions } from 'electron';
import { IWindowLoaderConfig } from './window-loader-config.interface';

export interface IWindowConfig {
  options?: BrowserWindowConstructorOptions;
  loader: IWindowLoaderConfig;
  isDevelopmentMode?: boolean;
}
