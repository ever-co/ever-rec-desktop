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

export interface IDailyStatistics {
  totalDuration: number;
  activeDuration: number;
  idleDuration: number;
  productivity: number;
}

export interface IHourlyActivity {
  active: number;
  idle: number;
  locked: number;
}

export interface ITimeHeatMap {
  [key: string]: number;
}

export interface ITimeHeatMapMatrix {
  [key: string]: ITimeHeatMap;
}

export type IHourlyDistribution = Array<IHourlyActivity>;

export interface IProductivityInterval {
  totalDuration: number;
  activeDuration: number;
  productivity: number;
}

export interface IAggregatedProductivity {
  [key: string]: IProductivityInterval;
}

export type IActivityStateDistribution = {
  [state in IdleState]: number;
};

export interface IWorkPatternAnalysis {
  averageDailyHours: number;
  mostProductiveDay: string | null;
  mostProductiveHours: string[];
  consistencyScore: number;
}
