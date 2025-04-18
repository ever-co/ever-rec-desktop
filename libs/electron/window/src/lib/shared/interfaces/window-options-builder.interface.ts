import { BrowserWindowConstructorOptions } from 'electron';

export interface IWindowOptionsBuilder {
  build(
    customOptions?: BrowserWindowConstructorOptions
  ): BrowserWindowConstructorOptions;
}
