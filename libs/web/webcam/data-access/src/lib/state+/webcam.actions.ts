import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WebcamActions = createActionGroup({
  source: 'Webcam',
  events: {
    'Load Webcams': emptyProps(),
    'Load Webcams Success': props<{ webcams: MediaDeviceInfo[] }>(),
    'Load Webcams Failure': props<{ error: string }>(),
    'Check Webcam Authorization': emptyProps(),
    'Check Webcam Authorization Success': emptyProps(),
    'Check Webcam Authorization Failure': props<{ error: string }>(),
    'Select Webcam': props<{ deviceId?: string; tracking?: boolean }>(),
    'Select Webcam Success': props<{ deviceId?: string; tracking?: boolean }>(),
    'Select Webcam Failure': props<{ error: string }>(),
  },
});
