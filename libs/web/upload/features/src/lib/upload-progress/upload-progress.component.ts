import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUploadState  } from '@ever-co/upload-data-access';
import { map, Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-upload-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './upload-progress.component.html',
  styleUrl: './upload-progress.component.scss',
})
export class UploadProgressComponent {
  constructor(private readonly store: Store){}

  public get progress$(): Observable<number> {
    return this.store.select(selectUploadState).pipe(map(state => state.progress / 100));
  }

  public get uploading$(): Observable<boolean> {
    return this.store.select(selectUploadState).pipe(map(state => state.uploading));
  }
}
