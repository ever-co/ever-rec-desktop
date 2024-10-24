export interface ILogger {
  info(...message: any[]): void;
  error(...message: any[]): void;
  warn(...message: any[]): void;
  debug(...message: any[]): void;
}
