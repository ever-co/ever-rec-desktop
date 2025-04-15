import { IWindowConfig } from '../interfaces/window-config.interface';
import { IWindowLoader } from '../interfaces/window-loader.interface';
import { FormatLoader } from './loaders/format.loader';
import { UrlLoader } from './loaders/url.loader';
import { app } from 'electron';

export class WindowLoaderContext {
  private readonly loader: IWindowLoader;

  constructor(private readonly config: IWindowConfig) {
    if (app.isPackaged) {
      this.loader = new FormatLoader();
    } else {
      this.loader = new UrlLoader();
    }
  }

  public url(): string {
    return this.loader.build(this.config.loader);
  }
}
