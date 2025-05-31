import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import {
  audioRecordingActions,
  cameraActions,
  photoCaptureActions,
  selectAudioKillSwitch,
  selectCameraAuthorizations,
  selectCameraStreaming,
  selectRecordingState,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { PreviewComponent } from '../camera/preview/preview.component';

@Component({
  selector: 'lib-webcam',
  standalone: true,
  imports: [PreviewComponent, ActionButtonGroupComponent],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();
  private readonly closing$ = new Subject<boolean>();
  readonly buttons: IActionButton[] = [
    {
      icon: 'close_fullscreen',
      variant: 'default',
      action: this.hide.bind(this),
      tooltip: 'Minimize',
    },
    {
      icon: 'pause',
      variant: 'danger',
      loading: this.closing$.asObservable(),
      action: this.stopTracking.bind(this),
      tooltip: 'Stop Tracking',
    },
    {
      icon: 'mic',
      variant: 'warning',
      hide: this.micOff$,
      action: this.stopRecording.bind(this),
      tooltip: 'Stop Recording Audio',
    },
    {
      icon: 'mic_off',
      variant: 'danger',
      hide: this.micOn$,
      action: this.startRecording.bind(this),
      tooltip: 'Start Recording Audio',
    },
  ];

  ngOnInit(): void {
    this.store
      .select(selectAudioKillSwitch)
      .pipe(
        filter(Boolean),
        tap(() => this.stopTracking()),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store
      .select(selectScreenshotState)
      .pipe(
        filter(({ capturing }) => !capturing),
        take(1),
        tap(() => this.stopTracking())
      )
      .subscribe();

    this.store.dispatch(cameraActions.loadCameras());
  }

  private stopTracking(): void {
    this.micOn$
      .pipe(
        take(1),
        tap((micIsOn) => {
          this.closing$.next(true);
          if (micIsOn) {
            this.stopRecording(true);
          } else {
            this.store.dispatch(photoCaptureActions.stopTracking());
          }
        })
      )
      .subscribe();
  }

  private get micOn$(): Observable<boolean> {
    return this.store.select(selectRecordingState).pipe(
      distinctUntilChanged(),
      withLatestFrom(this.store.select(selectCameraAuthorizations)),
      map(
        ([isRecording, { canUseMicrophone }]) => canUseMicrophone && isRecording
      ),
      takeUntil(this.destroy$)
    );
  }

  private get micOff$(): Observable<boolean> {
    return this.micOn$.pipe(
      distinctUntilChanged(),
      map((value) => !value)
    );
  }

  private startRecording(): void {
    this.store
      .select(selectCameraStreaming)
      .pipe(
        filter(({ stream }) => Boolean(stream)),
        take(1),
        withLatestFrom(this.store.select(selectCameraAuthorizations)),
        tap(([{ stream }, { canUseMicrophone }]) => {
          if (!canUseMicrophone) {
            return console.log('No permission to use microphone');
          }
          this.store.dispatch(audioRecordingActions.startRecording({ stream }));
        })
      )
      .subscribe();
  }

  private stopRecording(delayed?: boolean): void {
    this.store.dispatch(audioRecordingActions.stopRecording({ delayed }));
  }

  private hide(): void {
    //TODO: Implement hide
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.closing$.next(false);
    this.closing$.complete();
    this.stopRecording();
  }
}
