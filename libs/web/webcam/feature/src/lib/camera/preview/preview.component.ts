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
  selectCameraAuthorizations,
  selectCameraPersistance,
  selectCameraStreaming,
  selectPhotoSaving,
  selectPhotoState,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  from,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ControlComponent } from '../control/control.component';
import { MatIconModule } from '@angular/material/icon';
import { IPhoto } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-preview',
  standalone: true,
  imports: [CommonModule, ControlComponent, MatIconModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false })
  private videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('anchor', { static: false })
  private anchorElement!: ElementRef<HTMLAnchorElement>;
  @Input()
  public control = true;
  private readonly destroy$ = new Subject<void>();
  public done$ = new BehaviorSubject<boolean>(false);

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

  public onCapture() {
    this.capture();
    this.done$.next(true);
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
        filter(({ canUseCamera }) => canUseCamera),
        tap(({ resolution }) =>
          this.store.dispatch(photoActions.savePhoto({ dataURL, resolution }))
        )
      )
      .subscribe();
  }

  private initCameraPreview(): void {
    const cameraConfig$ = this.store.select(selectCameraPersistance).pipe(
      map((persistence) => ({
        deviceId: persistence.deviceId,
        microphoneId: persistence.microphoneId,
      })),
      distinctUntilChanged(
        (prev, curr) =>
          prev.deviceId === curr.deviceId &&
          prev.microphoneId === curr.microphoneId
      ),
      filter(({ deviceId, microphoneId }) => !!deviceId || !!microphoneId),
      shareReplay(1) // Avoid duplicate side effects if there are multiple subscribers
    );

    cameraConfig$
      .pipe(
        tap(({ deviceId, microphoneId }) => {
          try {
            this.startStreaming(deviceId, microphoneId);
          } catch (err) {
            this.handleStreamError(err);
          }
        }),
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

          videoElement.muted = true;
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

  private startStreaming(deviceId?: string, microphoneId?: string): void {
    this.store
      .select(selectCameraStreaming)
      .pipe(
        take(1),
        withLatestFrom(this.store.select(selectCameraAuthorizations)),
        tap(([{ stream }, { canUseCamera, canUseMicrophone }]) =>
          this.store.dispatch(
            cameraActions.createCameraStream({
              deviceId,
              microphoneId,
              stream,
              canUseCamera,
              canUseMicrophone,
            })
          )
        )
      )
      .subscribe();
  }

  private stopStreaming(): void {
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

  public get photo$(): Observable<IPhoto | null> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.photo),
      takeUntil(this.destroy$)
    );
  }

  public redirect(event: Event, pathname: string): void {
    event.stopPropagation();
    const anchor = this.anchorElement?.nativeElement;
    if (!anchor) {
      return;
    }
    anchor.href = pathname;
    anchor.click();
    this.done$.next(false);
  }

  private cleanup(): void {
    this.stopStreaming();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
