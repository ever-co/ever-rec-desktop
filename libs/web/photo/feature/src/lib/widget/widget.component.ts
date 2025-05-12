import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NumberSuffixPipe } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { selectPhotoState } from '@ever-co/photo-data-access';

@Component({
  selector: 'lib-photo-widget',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    NumberSuffixPipe,
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class PhotoWidgetComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store) {}

  public get photoCount$(): Observable<number> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.count),
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
