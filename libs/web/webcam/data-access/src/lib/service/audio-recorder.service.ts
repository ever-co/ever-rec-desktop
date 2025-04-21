import { Injectable } from '@angular/core';
import { IAudioSave } from '@ever-co/shared-utils';
import { Observable, defer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  public start(stream: MediaStream | null): Observable<IAudioSave> {
    return defer(() => {
      // Clear previous state
      this.cleanup();

      return new Observable<IAudioSave>((observer) => {
        if (!stream) {
          observer.error(new Error('No stream provided'));
          return;
        }

        try {
          this.mediaRecorder = new MediaRecorder(stream);
          this.chunks = [];

          this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
            if (e.data.size > 0) {
              this.chunks.push(e.data);
            }
          };

          this.mediaRecorder.onstop = async () => {
            try {
              const blob = new Blob(this.chunks, {
                type: 'audio/webm; codecs=opus',
              });
              const arrayBuffer = await blob.arrayBuffer();

              const audioContext = new AudioContext();
              const audioBuffer = await audioContext.decodeAudioData(
                arrayBuffer.slice(0)
              );

              audioContext.close();

              const duration = audioBuffer.duration;
              const channels = audioBuffer.numberOfChannels;
              const rate = audioBuffer.sampleRate;

              observer.next({ arrayBuffer, duration, channels, rate });
              observer.complete();
            } catch (error) {
              console.error(error);
              observer.error(error);
            } finally {
              this.cleanup();
            }
          };

          this.mediaRecorder.onerror = (event: Event) => {
            observer.error(new Error(`MediaRecorder error: ${event}`));
            this.cleanup();
          };

          // Start recording with timeslice for regular data updates
          this.mediaRecorder.start(3000); // 3 seconds timeslice
        } catch (error) {
          observer.error(new Error(`Failed to start recording: ${error}`));
          this.cleanup();
        }

        return () => {
          this.stop();
        };
      });
    });
  }

  public stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.error('Error stopping media recorder:', error);
      }
    }
  }

  private cleanup(): void {
    if (this.mediaRecorder) {
      // Remove all event listeners
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onerror = null;
    }
    this.chunks = [];
    this.mediaRecorder = null;
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./audio.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}

