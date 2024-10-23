import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { InfiniteScrollDirective } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { SearchService } from '../search/search.service';

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
    InfiniteScrollDirective,
  ],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent implements OnInit {
  private readonly searchService = inject(SearchService);
  public recents = this.searchService.search;
  public searchTerm = this.searchService.searchTerm;
  private currentPage = 1;
  private hasNext = false;

  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          console.log(state)
          this.hasNext = state.search.hasNext;
          this.searchService.search.set(state.search.screenshots);
        })
      )
      .subscribe();
  }

  public moreResult(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadResults();
    }
  }

  public loadResults(): void {
    this.store.dispatch(
      screenshotActions.ask({
        page: this.currentPage,
        filter: this.searchTerm(),
      })
    );
  }
}
