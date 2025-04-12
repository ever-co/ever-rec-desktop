import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  WebcamService,
  selectCameraPersistance,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import {
  catchError,
  EMPTY,
  filter,
  from,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'lib-preview',
  standalone: true,
  imports: [CommonModule, ControlComponent],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false })
  private videoElement!: ElementRef<HTMLVideoElement>;

  private readonly destroy$ = new Subject<void>();
  private readonly webcamService = inject(WebcamService);
  private readonly notificationService = inject(NotificationService);
  private readonly store = inject(Store);

  public ngAfterViewInit(): void {
    this.initCameraPreview();
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }

  private initCameraPreview(): void {
    this.store
      .select(selectCameraPersistance)
      .pipe(
        map((persistence) => persistence.selectedWebcam?.deviceId),
        filter(Boolean), // Simplified type guard
        switchMap((deviceId) => this.startCameraStream(deviceId)),
        catchError((err) => {
          this.handleStreamError(err);
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private startCameraStream(deviceId: string) {
    return from(this.webcamService.start(this.elementRef, deviceId)).pipe(
      tap({
        error: (err) => this.handleStreamError(err),
      })
    );
  }

  private handleStreamError(err: unknown): void {
    this.notificationService.show(
      `Error starting media stream: ${err}`,
      'error'
    );
  }

  private get elementRef(): HTMLVideoElement {
    return this.videoElement?.nativeElement;
  }

  private cleanup(): void {
    if (this.elementRef) {
      this.webcamService.stop(this.elementRef);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
