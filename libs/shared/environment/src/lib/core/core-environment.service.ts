import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import {
  IEnvironmentReader,
  ValidationResult,
} from '../interfaces/environment.interface';

// Core Environment Service - Combines best practices with simplicity
@Injectable({
  providedIn: 'root',
})
export class CoreEnvironmentService implements IEnvironmentReader {
  private environmentData: Record<string, string> = {};
  private isInitialized = false;

  // Reactive state
  private dataSubject = new BehaviorSubject<Record<string, string>>({});
  public readonly data$ = this.dataSubject
    .asObservable()
    .pipe(distinctUntilChanged(), shareReplay(1));

  constructor() {
    this.initialize();
  }

  private detectEnvironment(): 'development' | 'production' {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return hostname === 'localhost' || hostname.includes('127.0.0.1')
        ? 'development'
        : 'production';
    }
    return 'development';
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load environment variables directly
      this.environmentData = await this.loadEnvironmentVars();
      this.dataSubject.next(this.environmentData);
      this.isInitialized = true;
      console.info('Environment initialized successfully');
    } catch (error) {
      console.error('Environment initialization failed:', error);
      this.environmentData = {};
      this.isInitialized = true;
    }
  }

  private async loadEnvironmentVars(): Promise<Record<string, string>> {
    try {
      // Determine the correct path based on environment type
      const envPath =
        this.detectEnvironment() === 'production'
          ? './environment.prod'
          : './environment.dev';

      // Use dynamic loading to avoid TypeScript compilation issues
      const envModule = await import(envPath);
      const environment = envModule.environment || {};

      // Extract environment variables (excluding the production flag)
      const { production, ...envVars } = environment;
      return envVars;
    } catch (error) {
      console.warn('Failed to load environment variables:', error);
      return {};
    }
  }

  // Core interface implementation
  async get(key: string, defaultValue: string = ''): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.environmentData[key] || defaultValue;
  }

  async getBoolean(
    key: string,
    defaultValue: boolean = false,
  ): Promise<boolean> {
    const value = await this.get(key);
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.get(key);
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  async has(key: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return key in this.environmentData;
  }

  async getAll(): Promise<Record<string, string>> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return { ...this.environmentData };
  }

  // Synchronous methods for performance-critical scenarios
  getSync(key: string, defaultValue: string = ''): string {
    return this.environmentData[key] || defaultValue;
  }

  getBooleanSync(key: string, defaultValue: boolean = false): boolean {
    const value = this.getSync(key);
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  getNumberSync(key: string, defaultValue: number = 0): number {
    const value = this.getSync(key);
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  // Synchronous version for immediate access
  getAllSync(): Record<string, string> {
    return { ...this.environmentData };
  }

  // Utility methods
  async reload(): Promise<void> {
    this.isInitialized = false;
    await this.initialize();
  }

  // Basic validation
  async validate(): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Check required fields
    const requiredFields = ['API_URL', 'APP_NAME'];
    for (const field of requiredFields) {
      if (!this.environmentData[field]) {
        errors.push({
          key: field,
          message: `Required field ${field} is missing`,
          severity: 'error',
          code: 'REQUIRED_FIELD_MISSING',
        });
      }
    }

    // Check production-specific rules
    if (this.detectEnvironment() === 'production') {
      if (this.environmentData['DEBUG'] === 'true') {
        warnings.push({
          key: 'DEBUG',
          message: 'Debug mode is enabled in production',
          suggestion: 'Consider disabling debug mode in production',
          code: 'DEBUG_IN_PRODUCTION',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Health check
  isReady(): boolean {
    return this.isInitialized;
  }
}
