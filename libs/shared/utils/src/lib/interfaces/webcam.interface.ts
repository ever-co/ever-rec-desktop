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
  resolution?: Resolution;
}

export enum Resolution {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface IConstraintStream {
  deviceId?: string;
  stream?: MediaStream | null;
  resolution?: Resolution;
}
