export interface IVideoConfig {
  frameRate: number;
  resolution: string;
  duration: string;
  codec: string;
}

export interface IVideoConvertPayload {
  screenshotIds: string[];
  config: IVideoConfig;
}
