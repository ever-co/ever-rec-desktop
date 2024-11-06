import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { map, Observable, tap } from 'rxjs';

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
})
export class SearchOverlayComponent implements OnInit {
  public searchTerm = '';

  constructor(private readonly store: Store, private readonly router: Router) {}
  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(tap((state) => (this.searchTerm = state.search.filter)))
      .subscribe();
  }

  public get count$(): Observable<number> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.search.count));
  }

  public get recents$(): Observable<string[]> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.search.history));
  }

  public onRemove(event: Event, searchQuery: string): void {
    event.stopPropagation();
    this.store.dispatch(screenshotActions.removeFromHistory({ searchQuery }));
  }
}
