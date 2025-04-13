import { IBase } from './base.interface';
import { ITimeLog } from './time-log.interface';

export interface IPhoto extends IBase {
  pathname: string;
  synced?: boolean;
  timeLog?: ITimeLog;
}

export interface ICameraPersistance {
  isAuthorized?: boolean;
  deviceId?: string;
  tracking?: boolean;
}
