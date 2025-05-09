import { UploadEventHandler } from './upload/upload-event.handler';

const handler = new UploadEventHandler();

export function uploadEventListener() {
  handler.register();
}

export function removeUploadEvent(): void {
  handler.unregister();
}
