// Simplified Environment Interfaces - Only what's actually used

// Core environment reader interface
export interface IEnvironmentReader {
  get(key: string, defaultValue?: string): Promise<string>;
  getBoolean(key: string, defaultValue?: boolean): Promise<boolean>;
  getNumber(key: string, defaultValue?: number): Promise<number>;
  has(key: string): Promise<boolean>;
  getAll(): Promise<Record<string, string>>;
}

// Google configuration interface
export interface IGoogleConfig {
  readonly redirectUri: string;
  readonly clientId: string;
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  key: string;
  message: string;
  severity: 'error' | 'critical';
  code?: string;
}

export interface ValidationWarning {
  key: string;
  message: string;
  suggestion?: string;
  code?: string;
}

// Environment configuration keys with defaults
export const ENV_DEFAULTS = {
  IS_PLUGIN: false,
  CAN_USE_WEB_WORKER: true,
  APP_NAME: 'Ever Rec',
  APP_ICON: 'fiber_smart_record',
  USE_EMULATORS: true,
  API_URL: 'http://localhost:3000',
  DEBUG: false,
  PORT: 4201,
  GOOGLE_REDIRECT_URI: 'http://localhost:4200/authorize',
  GOOGLE_CLIENT_ID: '331856596503-27e2jg0qi44bu0thotgg36gds735ue5s.apps.googleusercontent.com'
} as const;

export type EnvironmentKey = keyof typeof ENV_DEFAULTS;
