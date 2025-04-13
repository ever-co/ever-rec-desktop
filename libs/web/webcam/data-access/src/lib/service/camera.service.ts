import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public async availableDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === 'videoinput');
    } catch (err) {
      console.error('Error enumerating devices:', err);
      return [];
    }
  }

  /**
   * Capture screenshot from current webcam stream
   * @returns Observable with base64 image data
   */
  public capture(element: HTMLVideoElement): string {
    if (!element) {
      throw new Error('Webcam not initialized');
    }

    const canvas = document.createElement('canvas');
    canvas.width = element.videoWidth || 640;
    canvas.height = element.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
}
