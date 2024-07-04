export interface IVideoConfig {
  frameRate: number;
  resolution: string;
  duration: number;
  codec: string;
  batch: number;
}

export interface IVideoConvertPayload {
  screenshotIds: string[];
  config: IVideoConfig;
}
