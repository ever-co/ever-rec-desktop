import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { SearchService } from './search.service';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    OverlayModule,
    SearchOverlayComponent,
    MatProgressSpinner,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private readonly searchService = inject(SearchService);
  public overlayOpen = this.searchService.overlayOpen;
  @ViewChild('overlayPosition') overlay!: CdkOverlayOrigin;

  constructor(private readonly store: Store) {}
  public get offsetWidth() {
    if (this.overlay) {
      return this.overlay.elementRef.nativeElement.offsetWidth;
    }
  }

  public onChange(value: string) {
    of(value)
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
        debounceTime(1000),
        tap((filter) => {
          this.store.dispatch(screenshotActions.resetAsk());
          this.store.dispatch(screenshotActions.ask({ filter, page: 1 }));
          this.searchService.searchTerm.set(filter);
        })
      )
      .subscribe();
  }

  public get isLoading$(): Observable<boolean> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.search.loading));
  }
}
