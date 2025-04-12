import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaStreamService {
  private stream: MediaStream | null = null;

  public async start(
    element: HTMLVideoElement,
    deviceId?: string
  ): Promise<MediaStream> {
    if (!element) {
      throw new Error('HTMLVideoElement is required');
    }

    // Clean up any existing stream
    this.stop(element);

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? {
              deviceId: { exact: deviceId },
            }
          : true,
        audio: false,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      element.srcObject = this.stream;
      return this.stream;
    } catch (err) {
      console.error('MediaStream error:', err);
      throw new Error(
        `Failed to start media stream: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  public stop(element?: HTMLVideoElement): void {
    try {
      // Stop all tracks if stream exists
      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.stream = null;
      }

      // Clean up video element if provided
      if (element) {
        element.srcObject = null;
        element.pause();
      }
    } catch (err) {
      console.error('Error while stopping media stream:', err);
    }
  }

  public getActiveStream(): MediaStream | null {
    return this.stream;
  }

  public async getAvailableDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === 'videoinput');
    } catch (err) {
      console.error('Error enumerating devices:', err);
      return [];
    }
  }
}
