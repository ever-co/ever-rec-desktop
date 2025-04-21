import { Resolution } from '@ever-co/shared-utils';

/**
 * Interface for authorization permissions
 */
export interface Authorization {
  canUseCamera: boolean;
  canUseMicrophone: boolean;
}

/**
 * Interface for device configuration
 */
export interface DeviceConfig {
  deviceId?: string;
  microphoneId?: string;
}

/**
 * Default resolution presets for video constraints
 */
const RESOLUTION_PRESETS: Record<Resolution, MediaTrackConstraints> = {
  low: { width: { ideal: 1280 }, height: { ideal: 720 } },
  medium: { width: { ideal: 1920 }, height: { ideal: 1080 } },
  high: { width: { ideal: 3840 }, height: { ideal: 2160 } },
};

/**
 * Default video constraints for high quality video
 */
const DEFAULT_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  frameRate: { ideal: 60 },
  aspectRatio: { ideal: 16 / 9 },
  facingMode: { ideal: 'user' },
};

/**
 * Default audio constraints for high quality audio
 */
const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: { ideal: true },
  noiseSuppression: { ideal: true },
  autoGainControl: { ideal: true },
};

export class MediaConstraintsBuilder {
  /**
   * Gets media constraints based on resolution, authorization, and device configuration
   * @param resolution The desired video resolution
   * @param authorization The authorization permissions
   * @param device The device configuration
   * @returns MediaStreamConstraints object
   */
  public getMediaConstraints(
    resolution: Resolution,
    authorization: Authorization,
    device: DeviceConfig
  ): MediaStreamConstraints {
    const video = this.buildVideoConstraints(
      RESOLUTION_PRESETS[resolution],
      device.deviceId,
      authorization.canUseCamera
    );

    const audio = this.buildAudioConstraints(
      device.microphoneId,
      authorization.canUseMicrophone
    );

    return { video, audio };
  }

  /**
   * Builds video constraints based on resolution, device ID, and authorization
   * @param resolution The base resolution constraints
   * @param deviceId Optional specific device ID
   * @param canUseCamera Whether camera use is authorized
   * @returns MediaTrackConstraints or boolean
   */
  private buildVideoConstraints(
    resolution: MediaTrackConstraints,
    deviceId?: string,
    canUseCamera: boolean = false
  ): MediaTrackConstraints | boolean {
    if (!canUseCamera) return false;

    const constraints: MediaTrackConstraints = {
      ...DEFAULT_VIDEO_CONSTRAINTS,
      ...resolution,
    };

    if (deviceId) {
      constraints.deviceId = { exact: deviceId };
    }

    return constraints;
  }

  /**
   * Builds audio constraints based on microphone ID and authorization
   * @param microphoneId Optional specific microphone ID
   * @param canUseMicrophone Whether microphone use is authorized
   * @returns MediaTrackConstraints or boolean
   */
  private buildAudioConstraints(
    microphoneId?: string,
    canUseMicrophone: boolean = false
  ): MediaTrackConstraints | boolean {
    if (!canUseMicrophone) return false;

    const constraints: MediaTrackConstraints = {
      ...DEFAULT_AUDIO_CONSTRAINTS,
    };

    if (microphoneId) {
      constraints.deviceId = { exact: microphoneId };
    }

    return constraints;
  }
}
