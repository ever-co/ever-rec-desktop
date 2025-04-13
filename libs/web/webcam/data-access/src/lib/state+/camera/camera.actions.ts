import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const cameraActions = createActionGroup({
  source: 'Camera',
  events: {
    'Load Cameras': emptyProps(),
    'Load Cameras Success': props<{ cameras: MediaDeviceInfo[] }>(),
    'Load Cameras Failure': props<{ error: string }>(),

    'Check Camera Authorization': emptyProps(),
    'Check Camera Authorization Success': emptyProps(),
    'Check Camera Authorization Failure': props<{ error: string }>(),

    'Select Camera': props<{ deviceId?: string; tracking?: boolean }>(),
    'Select Camera Success': props<{ deviceId?: string; tracking?: boolean }>(),
    'Select Camera Failure': props<{ error: string }>(),

    'Create Camera Stream': props<{
      deviceId: string;
      stream?: MediaStream | null;
    }>(),
    'Create Camera Stream Success': props<{ stream: MediaStream | null }>(),
    'Create Camera Stream Failure': props<{ error: string }>(),

    'Close Camera Stream': props<{ stream: MediaStream | null }>(),
    'Close Camera Stream Success': emptyProps(),
    'Close Camera Stream Failure': props<{ error: string }>(),

    'Take Photo': props<{ dataURL: string }>(),
  },
});
