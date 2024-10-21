export interface IVideoConfig {
  frameRate: number;
  resolution: string;
  duration: number;
  codec: string;
  batch: number;
  optimized?: boolean;
  autoGeneration: boolean;
  period: number;
}

export interface IVideoConvertPayload {
  filter?: string;
  config: IVideoConfig;
}
