import { autoVideoGenerateEvent, removeAutoVideoGenerateEvent } from './auto-video-generate.event';
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
import { crudTimeLogEvents, removeCrudTimeLogEvent } from './crud-time-log.event';
import { crudVideoEvents, removeCrudVideoEvent } from './crud-video.event';
import { MainEvents, removeMainEvents } from './main.event';
import { removeRetentionEvents, retentionEvents } from './retention.event';
import { removeUploadEvent, uploadEventListener } from './upload.event';

export function subscribeEvents() {
  captureScreenEvent();
  convertScreenshotsToVideoEvent();
  crudScreeshotEvents();
  uploadEventListener();
  crudVideoEvents();
  crudTimeLogEvents();
  retentionEvents();
  autoVideoGenerateEvent();
  MainEvents();
}

export function unsubscribeEvents() {
  removeCrudScreenshotEvent();
  removeCaptureScreenEvent();
  removeUploadEvent();
  removeConvertScreenshotsToVideoEvent();
  removeCrudVideoEvent();
  removeCrudTimeLogEvent();
  removeRetentionEvents();
  removeAutoVideoGenerateEvent();
  removeMainEvents();
}
