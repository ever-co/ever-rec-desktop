export interface IVideoConfig {
  frameRate: number;
  resolution: string;
  duration: number;
  codec: string;
  batch: number;
  optimized?: boolean;
}

export interface IVideoConvertPayload {
  filter?: string;
  config: IVideoConfig;
}
