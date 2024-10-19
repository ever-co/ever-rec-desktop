import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
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
  ],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent implements OnInit {
  private readonly searchService = inject(SearchService);
  public recents = this.searchService.search;
  public searchTerm = this.searchService.searchTerm;

  constructor(private readonly store: Store) {

  }
  ngOnInit(): void {
    this.store.select(selectScreenshotState).pipe(
      tap((state) => {
        this.searchService.search.set(state.screenshots)
      })
    ).subscribe()
  }
}
