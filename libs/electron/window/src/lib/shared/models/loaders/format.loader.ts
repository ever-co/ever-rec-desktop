import { IWindowLoaderConfig } from '../../interfaces/window-loader-config.interface';
import { IWindowLoader } from '../../interfaces/window-loader.interface';
import * as url from 'url';

export class FormatLoader implements IWindowLoader {
  public build(config: IWindowLoaderConfig): string {
    return url.format({
      pathname: config.path,
      protocol: 'file:',
      slashes: true,
      hash: config.hash,
    });
  }
}
