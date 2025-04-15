import { IWindowLoaderConfig } from './window-loader-config.interface';

export interface IWindowLoader {
  build(config: IWindowLoaderConfig): string;
}
