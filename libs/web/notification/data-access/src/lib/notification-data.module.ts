import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { NotificationEffects } from './+state/notification.effects';
import { notificationFeature } from './+state/notification.reducer';

export function provideNotificationDataAccess(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(notificationFeature),
    provideEffects(NotificationEffects),
  ]);
}
