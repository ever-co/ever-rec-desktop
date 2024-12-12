import { IBase, IFindOneOptions } from './base.interface';
import { IScreenshotMetadata } from './screenshot.interface';

export interface IApplication extends IBase {
  name: string;
  icon: string;
  metadatas: IScreenshotMetadata[];
}

export interface IApplicationService {
  save(input: Partial<IApplication>): Promise<IApplication>;
  findOne(options: IFindOneOptions): Promise<IApplication>;
  deleteAll(screenshotIds?: string[]): Promise<void>;
}
