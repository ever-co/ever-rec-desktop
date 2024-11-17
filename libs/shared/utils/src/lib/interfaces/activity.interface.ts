import { IBase } from './base.interface';
import { ITimeLog } from './time-log.interface';

/** Possible system idle states */
export enum IdleState {
  ACTIVE = 'active',
  IDLE = 'idle',
  LOCKED = 'locked',
  UNKNOWN = 'unknown',
}

/** Event data structure for idle state changes */
export interface IdleStateChange {
  readonly idleTime: number;
  readonly idleState: IdleState;
  readonly duration: number;
  readonly timestamp: number;
}

export interface IActivity extends IBase {
  duration: number;
  state: IdleState;
  timeLog: ITimeLog;
  timeLogId: ITimeLog['id'];
}

export interface IActivityCreateInput {
  duration: number;
  state: IdleState;
  timeLogId: ITimeLog['id'];
}

export interface IActivityUpdateInput {
  duration: number;
}
