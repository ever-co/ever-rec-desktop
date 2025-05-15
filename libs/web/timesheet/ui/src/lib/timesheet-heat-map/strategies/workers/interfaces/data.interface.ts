import { IHeatMapDataPoint, ITimeLog } from '@ever-co/shared-utils';

// Interface Segregation Principle - Specific message interfaces
export enum MessageType {
  PROCESS_DAILY_DATA = '[Heat Map Data Worker] Process Daily Data',
  PROCESS_HOURLY_DATA = '[Heat Map Data Worker] Process Hourly Data',
  PROCESS_MONTHLY_DATA = '[Heat Map Data Worker] Process Monthly Data',
  PROCESSED = '[Heat Map Data Worker] Processed',
}

export interface HeatMapDataMessage {
  type: MessageType;
  data: ITimeLog[];
}

export interface ProcessDailyHeatMapDataMessage extends HeatMapDataMessage {
  type: MessageType.PROCESS_DAILY_DATA;
}

export interface ProcessHourlyHeatMapDataMessage extends HeatMapDataMessage {
  type: MessageType.PROCESS_HOURLY_DATA;
}

export interface ProcessMonthlyHeatMapDataMessage extends HeatMapDataMessage {
  type: MessageType.PROCESS_MONTHLY_DATA;
}

export interface HeatMapDataMessageHandler<T extends HeatMapDataMessage> {
  readonly messageType: T['type'];
  canHandle(message: HeatMapDataMessage): message is T;
  handle(message: T): void;
}

export interface DataProcessor {
  execute(data: ITimeLog[]): IHeatMapDataPoint[];
}

export type WorkerMessage =
  | ProcessDailyHeatMapDataMessage
  | ProcessHourlyHeatMapDataMessage
  | ProcessMonthlyHeatMapDataMessage;
