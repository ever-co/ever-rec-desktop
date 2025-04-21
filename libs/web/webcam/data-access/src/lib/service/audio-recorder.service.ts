import { Injectable } from '@angular/core';
import { IAudioSave } from '@ever-co/shared-utils';
import { Observable, defer, lastValueFrom } from 'rxjs';
import { AudioWorkerService } from './audio-woker.service';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  constructor(private readonly audioWorkerService: AudioWorkerService) {}

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
          this.mediaRecorder = new MediaRecorder(
            new MediaStream(stream.getAudioTracks())
          );

          this.chunks = [];

          this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
            if (e.data.size > 0) {
              this.chunks.push(e.data);
            }
          };

          this.mediaRecorder.onstop = async () => {
            try {
              const audioProcessed = await lastValueFrom(
                this.audioWorkerService.processAudio(this.chunks)
              );
              observer.next(audioProcessed);
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
