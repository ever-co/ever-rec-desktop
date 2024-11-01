export enum Source {
  WINDOW = 'window',
  SCREEN = 'screen',
}

export interface IScreenCaptureConfig {
  source: Source;
  period: number;
  captureAll: boolean;
}
