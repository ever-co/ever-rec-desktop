import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import {
  audioActions,
  cameraActions,
  photoActions,
  selectCameraAuthorizations,
  selectCameraStreaming,
  selectRecordingState,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { PreviewComponent } from '../preview/preview.component';
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

@Component({
  selector: 'lib-webcam',
  standalone: true,
  imports: [PreviewComponent, ActionButtonGroupComponent],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly buttons: IActionButton[] = [
    {
      icon: 'pause',
      variant: 'danger',
      action: this.stopTracking.bind(this),
    },
    {
      icon: 'mic',
      variant: 'warning',
      hide: this.micOff$,
      action: this.stopRecording.bind(this),
    },
    {
      icon: 'mic_off',
      variant: 'danger',
      hide: this.micOn$,
      action: this.startRecording.bind(this),
    },
  ];
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(cameraActions.loadCameras());
  }

  private stopTracking(): void {
    this.store.dispatch(photoActions.stopTracking());
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
          this.store.dispatch(audioActions.startRecording({ stream }));
        })
      )
      .subscribe();
  }

  private stopRecording(): void {
    this.store.dispatch(audioActions.stopRecording());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopRecording();
  }
}
