import { IConstraintStream, ICameraPersistance } from '@ever-co/shared-utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const cameraActions = createActionGroup({
  source: 'Camera',
  events: {
    'Load Cameras': emptyProps(),
    'Load Cameras Success': props<{
      cameras: MediaDeviceInfo[];
      microphones: MediaDeviceInfo[];
    }>(),
    'Load Cameras Failure': props<{ error: string }>(),

    'Check Camera Authorization': emptyProps(),
    'Check Camera Authorization Success': emptyProps(),
    'Check Camera Authorization Failure': props<{ error: string }>(),

    'Select Camera': props<ICameraPersistance>(),
    'Select Camera Success': props<ICameraPersistance>(),
    'Select Camera Failure': props<{ error: string }>(),

    'Create Camera Stream': props<IConstraintStream>(),
    'Create Camera Stream Success': props<{ stream: MediaStream | null }>(),
    'Create Camera Stream Failure': props<{ error: string }>(),

    'Close Camera Stream': props<{ stream: MediaStream | null }>(),
    'Close Camera Stream Success': emptyProps(),
    'Close Camera Stream Failure': props<{ error: string }>(),
  },
});
