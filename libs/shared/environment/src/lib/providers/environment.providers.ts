import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { REC_ENV } from '@ever-co/shared-service';
import { EnvironmentService } from '../services/environment.service';

// Environment provider for dependency injection
const ENVIRONMENT_PROVIDER: Provider = {
  provide: REC_ENV,
  useClass: EnvironmentService
};

export function provideEnvironment(): EnvironmentProviders {
  return makeEnvironmentProviders([ENVIRONMENT_PROVIDER]);
}