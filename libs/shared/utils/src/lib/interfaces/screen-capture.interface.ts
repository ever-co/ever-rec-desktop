export enum Source {
  WINDOWS = 'windows',
  SCREEN = 'screen',
}

export interface IScreenCaptureConfig {
  source: Source;
  period: number;
  retention: number;
}
