import { Injectable } from '@angular/core';
import { IConstraintStream, Resolution } from '@ever-co/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class CameraStreamService {
  public async createStream(
    constraint?: IConstraintStream
  ): Promise<MediaStream> {
    const {
      deviceId,
      resolution = Resolution.MEDIUM,
      stream,
    } = constraint || {};
    // Clean up any existing stream
    this.closeStream(stream);
    // Get stream constraints
    const constraints = this.constraints(resolution, deviceId);
    // Create a new stream
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  public constraints(
    resolution: Resolution,
    deviceId?: string
  ): MediaStreamConstraints {
    const resolutionMap: Record<
      Resolution,
      { width: { ideal: number }; height: { ideal: number } }
    > = {
      low: { width: { ideal: 1280 }, height: { ideal: 720 } },
      medium: { width: { ideal: 1920 }, height: { ideal: 1080 } },
      high: { width: { ideal: 4096 }, height: { ideal: 2160 } },
    };

    const selected = resolutionMap[resolution];

    return {
      video: deviceId
        ? {
            deviceId: { exact: deviceId },
            ...selected,
          }
        : true,
      audio: false,
    };
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
