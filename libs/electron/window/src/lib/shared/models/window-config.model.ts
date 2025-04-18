import { BrowserWindowConstructorOptions } from 'electron';
import { IWindowConfig } from '../interfaces/window-config.interface';
import { IWindowOptionsBuilder } from '../interfaces/window-options-builder.interface';
import { WindowOptionsBuilder } from './window-options-builder.model';
import { IWindowLoaderConfig } from '../interfaces/window-loader-config.interface';

export class WindowConfig implements IWindowConfig {
  public readonly options: BrowserWindowConstructorOptions;
  public readonly loader: IWindowLoaderConfig;
  private readonly builder: IWindowOptionsBuilder;

  constructor(
    loader: IWindowLoaderConfig,
    isDevMode = false,
    options?: BrowserWindowConstructorOptions
  ) {
    this.loader = loader;
    this.builder = new WindowOptionsBuilder(isDevMode);
    this.options = this.builder.build(options);
  }
}
