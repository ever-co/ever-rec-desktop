import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import {
  cameraActions,
  photoActions,
  selectCameraAuthorizations,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { PreviewComponent } from '../preview/preview.component';
import { map, Observable, Subject, takeUntil } from 'rxjs';

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
      action: this.stopTracking.bind(this),
    },
    {
      icon: 'mic_off',
      variant: 'danger',
      hide: this.micOn$,
      action: this.stopTracking.bind(this),
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
    return this.store.select(selectCameraAuthorizations).pipe(
      map(({ canUseMicrophone }) => canUseMicrophone),
      takeUntil(this.destroy$)
    );
  }

  private get micOff$(): Observable<boolean> {
    return this.store.select(selectCameraAuthorizations).pipe(
      map(({ canUseMicrophone }) => !canUseMicrophone),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
