import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  public get generating$(): Observable<boolean> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );
  }
  public get progress$(): Observable<number> {
    return this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.progress),
      takeUntil(this.destroy$)
    );
  }
}
