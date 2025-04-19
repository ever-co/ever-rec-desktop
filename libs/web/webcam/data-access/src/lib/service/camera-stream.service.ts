import { Injectable } from '@angular/core';
import { IConstraintStream, Resolution } from '@ever-co/shared-utils';
import { MediaConstraintsBuilder } from './media-contraint.builder';

@Injectable({
  providedIn: 'root',
})
export class CameraStreamService {
  private readonly mediaConstraintsBuilder = new MediaConstraintsBuilder();

  public async createStream(
    constraint?: IConstraintStream
  ): Promise<MediaStream> {
    const {
      deviceId,
      microphoneId,
      resolution = Resolution.MEDIUM,
      canUseCamera = true,
      canUseMicrophone = false,
      stream,
    } = constraint || {};
    // Clean up any existing stream
    this.closeStream(stream);
    // Get stream constraints
    const constraints = this.mediaConstraintsBuilder.getMediaConstraints(
      resolution,
      { canUseCamera, canUseMicrophone },
      { deviceId, microphoneId }
    );
    // Create a new stream
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
