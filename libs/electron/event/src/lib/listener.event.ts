import {
  captureScreenEvent,
  removeCaptureScreenEvent,
} from './capture-screen.event';
import {
  convertScreenshotsToVideoEvent,
  removeConvertScreenshotsToVideoEvent,
} from './convert-screenshots-to-video.event';
import {
  crudScreeshotEvents,
  removeCrudScreenshotEvent,
} from './crud-screenshot.event';
import { removeUploadEvent, uploadEventListener } from './upload.event';

export function subscribeEvents() {
  captureScreenEvent();
  convertScreenshotsToVideoEvent();
  crudScreeshotEvents();
  uploadEventListener();
}

export function unsubscribeEvents() {
  removeCrudScreenshotEvent();
  removeCaptureScreenEvent();
  removeUploadEvent();
  removeConvertScreenshotsToVideoEvent();
}
