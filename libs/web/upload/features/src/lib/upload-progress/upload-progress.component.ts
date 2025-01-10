import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUploadState } from '@ever-co/upload-data-access';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-upload-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './upload-progress.component.html',
  styleUrl: './upload-progress.component.scss',
})
export class UploadProgressComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get progress$(): Observable<number> {
    return this.store.select(selectUploadState).pipe(
      map((state) => state.progress / 100),
      takeUntil(this.destroy$)
    );
  }

  public get uploading$(): Observable<boolean> {
    return this.store.select(selectUploadState).pipe(
      map((state) => state.uploading),
      takeUntil(this.destroy$)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
