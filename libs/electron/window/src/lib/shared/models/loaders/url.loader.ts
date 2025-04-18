import { IWindowLoaderConfig } from '../../interfaces/window-loader-config.interface';
import { IWindowLoader } from '../../interfaces/window-loader.interface';

export class UrlLoader implements IWindowLoader {
  public build(config: IWindowLoaderConfig): string {
    const { port = 4200, route = '/' } = config || {};
    return `http://localhost:${port}${route}`;
  }
}
