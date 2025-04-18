import { BrowserWindowConstructorOptions } from 'electron';
import { IWindowOptionsBuilder } from '../interfaces/window-options-builder.interface';

export class WindowOptionsBuilder implements IWindowOptionsBuilder {
  constructor(private readonly isDevelopmentMode: boolean | undefined) {}

  build(
    customOptions: BrowserWindowConstructorOptions = {}
  ): BrowserWindowConstructorOptions {
    const defaultWidth = 1280;
    const defaultHeight = 720;

    const width = Math.min(100, customOptions.width ?? defaultWidth);
    const height = Math.min(100, customOptions.height ?? defaultHeight);

    return {
      width,
      height,
      show: false,
      vibrancy: 'fullscreen-ui',
      backgroundMaterial: 'acrylic',
      ...customOptions,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        webSecurity: !this.isDevelopmentMode,
        sandbox: !this.isDevelopmentMode,
        nodeIntegration: true,
        ...customOptions.webPreferences,
      },
    };
  }
}
