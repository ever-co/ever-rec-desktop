import { Injectable } from '@angular/core';
import { Observable, defer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  public start(stream: MediaStream | null): Observable<ArrayBuffer> {
    return defer(() => {
      // Clear previous state
      this.cleanup();

      return new Observable<ArrayBuffer>((observer) => {
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
                type: 'audio/ogg; codecs=opus',
              });

              const arrayBuffer = await blob.arrayBuffer();
              console.log(arrayBuffer);
              observer.next(arrayBuffer);
              observer.complete();
            } catch (error) {
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
