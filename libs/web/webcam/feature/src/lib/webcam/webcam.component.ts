import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { cameraActions } from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'lib-webcam',
  imports: [PreviewComponent],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(cameraActions.loadCameras());
  }
}
