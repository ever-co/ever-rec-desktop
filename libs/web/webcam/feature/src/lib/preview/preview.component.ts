import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  cameraActions,
  CameraService,
  photoActions,
  PhotoService,
  selectCameraPersistance,
  selectCameraStreaming,
  selectPhotoSaving,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  take,
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
  @Input()
  public control = true;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly cameraService: CameraService,
    private readonly notificationService: NotificationService,
    private readonly photoService: PhotoService,
    private readonly store: Store
  ) {}

  ngAfterViewInit(): void {
    this.handleAutoCapture();
    this.handleCameraStream();
    this.initCameraPreview();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  public capture(): void {
    if (!this.videoElement?.nativeElement) {
      console.warn('Video element not available for capture');
      return;
    }

    const dataURL = this.cameraService.capture(this.videoElement.nativeElement);

    this.store
      .select(selectCameraPersistance)
      .pipe(
        take(1),
        tap(({ resolution }) =>
          this.store.dispatch(photoActions.savePhoto({ dataURL, resolution }))
        )
      )
      .subscribe();
  }

  private initCameraPreview(): void {
    this.store
      .select(selectCameraPersistance)
      .pipe(
        map((persistence) => persistence.camera?.deviceId),
        distinctUntilChanged(),
        filter((deviceId): deviceId is string => !!deviceId), // Type predicate for better typing
        tap((deviceId) => this.startCamera(deviceId)),
        catchError((err) => {
          this.handleStreamError(err);
          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleCameraStream(): void {
    if (!this.videoElement?.nativeElement) {
      return;
    }

    const videoElement = this.videoElement.nativeElement;

    this.store
      .select(selectCameraStreaming)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ stream }) => {
          if (!stream) {
            videoElement.pause();
            videoElement.srcObject = null;
            return EMPTY;
          }

          videoElement.srcObject = stream;

          return from(videoElement.play()).pipe(
            catchError((error) => {
              console.error('Error playing the stream:', error);
              return EMPTY;
            })
          );
        }),
        catchError((err) => {
          console.error('Error in camera stream subscription:', err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private handleAutoCapture(): void {
    this.photoService
      .requestCapture()
      .pipe(
        tap(() => this.capture()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private startCamera(deviceId: string): void {
    this.store
      .select(selectCameraStreaming)
      .pipe(
        take(1),
        tap(({ stream }) =>
          this.store.dispatch(
            cameraActions.createCameraStream({ deviceId, stream })
          )
        )
      )
      .subscribe();
  }

  private stopCamera(): void {
    this.store
      .select(selectCameraStreaming)
      .pipe(
        take(1),
        tap(({ stream }) =>
          this.store.dispatch(cameraActions.closeCameraStream({ stream }))
        )
      )
      .subscribe();
  }

  private handleStreamError(err: unknown): void {
    const errorMessage = err instanceof Error ? err.message : String(err);
    this.notificationService.show(
      `Error starting media stream: ${errorMessage}`,
      'error'
    );
  }

  public get saving$(): Observable<boolean> {
    return this.store.select(selectPhotoSaving).pipe(takeUntil(this.destroy$));
  }

  private cleanup(): void {
    this.stopCamera();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
