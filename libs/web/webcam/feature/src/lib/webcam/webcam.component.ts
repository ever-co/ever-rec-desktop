import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import { cameraActions, photoActions } from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'lib-webcam',
  standalone: true,
  imports: [PreviewComponent, ActionButtonComponent],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamComponent implements OnInit {
  readonly stopButton: IActionButton = {
    icon: 'pause',
    variant: 'danger',
    action: this.stopTracking.bind(this),
  };
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(cameraActions.loadCameras());
  }

  private stopTracking(): void {
    this.store.dispatch(photoActions.stopTracking());
  }
}
