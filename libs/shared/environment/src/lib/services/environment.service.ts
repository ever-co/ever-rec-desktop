import { inject, Injectable } from '@angular/core';
import { IEnvironment } from '@ever-co/shared-utils';
import { CoreEnvironmentService } from '../core/core-environment.service';
import {
  IGoogleConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ENV_DEFAULTS,
  EnvironmentKey,
} from '../interfaces/environment.interface';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironment {
  private readonly coreService = inject(CoreEnvironmentService);

  // Type-safe environment variable access with defaults
  private getValue<K extends EnvironmentKey>(key: K): (typeof ENV_DEFAULTS)[K] {
    const defaultValue = ENV_DEFAULTS[key];

    if (typeof defaultValue === 'boolean') {
      return this.coreService.getBooleanSync(
        key,
        defaultValue,
      ) as (typeof ENV_DEFAULTS)[K];
    }

    if (typeof defaultValue === 'number') {
      return this.coreService.getNumberSync(
        key,
        defaultValue,
      ) as (typeof ENV_DEFAULTS)[K];
    }

    return this.coreService.getSync(
      key,
      defaultValue as string,
    ) as (typeof ENV_DEFAULTS)[K];
  }

  // Application Configuration
  get isPlugin(): boolean {
    return this.getValue('IS_PLUGIN');
  }

  get canUseWebWorker(): boolean {
    return this.getValue('CAN_USE_WEB_WORKER');
  }

  get appName(): string {
    return this.getValue('APP_NAME');
  }

  get icon(): string {
    return this.getValue('APP_ICON');
  }

  get useEmulators(): boolean {
    return this.getValue('USE_EMULATORS');
  }

  // API Configuration
  get apiUrl(): string {
    return this.getValue('API_URL');
  }

  get debug(): boolean {
    return this.getValue('DEBUG');
  }

  get port(): number {
    return this.getValue('PORT');
  }

  // Google Configuration (computed dynamically)
  get google(): IGoogleConfig {
    return {
      redirectUri: this.getValue('GOOGLE_REDIRECT_URI'),
      clientId: this.getValue('GOOGLE_CLIENT_ID'),
    };
  }

  // Utility methods
  getEnvVar(key: string, defaultValue: string = ''): string {
    return this.coreService.getSync(key, defaultValue);
  }

  getAllEnvVars(): Record<string, string> {
    return this.coreService.getAllSync();
  }

  // Validation with built-in rules
  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required fields validation
    const requiredFields: Array<{ key: EnvironmentKey; name: string }> = [
      { key: 'API_URL', name: 'API URL' },
      { key: 'APP_NAME', name: 'Application Name' },
    ];

    for (const { key, name } of requiredFields) {
      const value = this.getValue(key);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push({
          key,
          message: `${name} is required but not provided`,
          severity: 'error',
        });
      }
    }

    // URL format validation
    const apiUrl = this.getValue('API_URL');
    if (apiUrl && !this.isValidUrl(apiUrl)) {
      errors.push({
        key: 'API_URL',
        message: 'API URL is not a valid URL format',
        severity: 'error',
      });
    }

    // Production security warnings
    if (this.isProduction() && this.getValue('DEBUG')) {
      warnings.push({
        key: 'DEBUG',
        message: 'Debug mode is enabled in production environment',
        suggestion: 'Consider disabling debug mode in production for security',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Reload functionality
  async reload(): Promise<void> {
    await this.coreService.reload();
  }

  // Helper methods
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isProduction(): boolean {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return hostname !== 'localhost' && !hostname.includes('127.0.0.1');
    }
    return false;
  }

  // Configuration object getters (for advanced usage)
  getAppConfig() {
    return {
      isPlugin: this.isPlugin,
      canUseWebWorker: this.canUseWebWorker,
      appName: this.appName,
      icon: this.icon,
      useEmulators: this.useEmulators,
    };
  }

  getApiConfig() {
    return {
      apiUrl: this.apiUrl,
      debug: this.debug,
      port: this.port,
    };
  }

  getGoogleConfig(): IGoogleConfig {
    return this.google;
  }
}

