import { TimeLogType } from '../time-log.type';
import { IBase } from './base.interface';
import type { IScreenshot } from './screenshot.interface';

export interface ITimeLog extends IBase {
  start: Date | string;
  end: Date | string;
  duration: number;
  type: TimeLogType;
  screenshots: IScreenshot[];
  running: boolean;
  synced: boolean;
}

export interface ITimeLogSave {
  running: boolean,
  start?: Date | string;
}

export interface ITimeLogUpdate {
  id?: string;
  screenshotIds?: string[];
  running?: boolean;
  duration?: number;
  end?: Date | string;
}
