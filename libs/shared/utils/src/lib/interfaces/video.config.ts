export interface IVideoConfig {
  frameRate: number;
  resolution: string;
  duration: number;
  codec: string;
  batch: number;
  optimized?: boolean;
  autoGenerate: boolean;
  period: number;
  size?: number;
}

export interface IVideoConvertPayload {
  filter?: string;
  timeLogId?: string;
  screenshotIds?: string[];
  videoIds?: string[];
  config: IVideoConfig;
}
