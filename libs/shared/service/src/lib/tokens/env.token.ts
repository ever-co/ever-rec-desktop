import { InjectionToken } from '@angular/core';
import { IEnvironment } from '@ever-co/shared-utils';

export const REC_ENV = new InjectionToken<IEnvironment>(
  'ever.desktop.rec.environment'
);
