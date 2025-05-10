import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { selectGenerateVideoState } from '@ever-co/generate-video-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-generate-video-progress',
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './generate-video-progress.component.html',
  styleUrl: './generate-video-progress.component.scss',
})
export class GenerateVideoProgressComponent {
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$),
    );
  }
  public get progress$(): Observable<number> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => (state.progress || 0) / 100),
      takeUntil(this.destroy$),
    );
  }

  public get progressBar$(): Observable<number> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.progress || 0),
      takeUntil(this.destroy$),
    );
  }
}
