export interface IVideoConfig {
  frameRate: number;
  resolution: string;
  duration: number;
  codec: string;
}

export interface IVideoConvertPayload {
  screenshotIds: string[];
  config: IVideoConfig;
}
