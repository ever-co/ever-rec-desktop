import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraStreamService {
  public async createStream(
    deviceId?: string,
    stream?: MediaStream | null
  ): Promise<MediaStream> {
    // Clean up any existing stream
    this.closeStream(stream);

    const constraints: MediaStreamConstraints = {
      video: deviceId
        ? {
            deviceId: { exact: deviceId },
          }
        : true,
      audio: false,
    };

    return navigator.mediaDevices.getUserMedia(constraints);
  }

  public closeStream(stream?: MediaStream | null): void {
    // Stop all tracks if stream exists
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
}
