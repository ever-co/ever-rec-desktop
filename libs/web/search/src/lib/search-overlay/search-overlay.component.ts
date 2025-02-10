import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-search-overlay',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NoDataComponent,
  ],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchOverlayComponent implements OnInit, OnDestroy {
  public readonly destroy$ = new Subject<void>();
  public searchTerm = '';

  constructor(private readonly store: Store, private readonly router: Router) {}
  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => (this.searchTerm = state.search.filter)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get count$(): Observable<number> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.count),
      takeUntil(this.destroy$)
    );
  }

  public get recents$(): Observable<string[]> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.history),
      takeUntil(this.destroy$)
    );
  }

  public onRemove(event: Event, searchQuery: string): void {
    event.stopPropagation();
    this.store.dispatch(screenshotActions.removeFromHistory({ searchQuery }));
  }

  public onSelect(searchQuery: string): void {
    this.store.dispatch(screenshotActions.resetAsk());
    this.store.dispatch(
      screenshotActions.ask({ filter: searchQuery, page: 1 })
    );
    this.router.navigate(['/', 'search']);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
