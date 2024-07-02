import { IBase } from './base.interface';

export interface IScreenshot extends IBase {
  pathname: string;
  synced?: boolean;
}
