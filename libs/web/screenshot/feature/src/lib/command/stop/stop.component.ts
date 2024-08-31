import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-capture/screenshot-data-access';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-stop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stop.component.html',
  styleUrl: './stop.component.scss',
})
export class StopComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private destroy$ = new Subject<void>();
  public capturing$ = new Observable<boolean>();

  public ngOnInit(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing),
      takeUntil(this.destroy$)
    );
  }

  public stopCapture() {
    this.store.dispatch(screenshotActions.stopCapture());
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.capturing),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
