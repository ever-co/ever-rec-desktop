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
import { InfiniteScrollDirective } from '@ever-co/shared-service';
import { IScreenshot } from '@ever-co/shared-utils';
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
    InfiniteScrollDirective,
  ],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss',
})
export class SearchOverlayComponent implements OnInit {
  public searchTerm = '';
  private currentPage = 1;
  private hasNext = false;

  constructor(private readonly store: Store, private readonly router: Router) {}
  ngOnInit(): void {
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          this.hasNext = state.search.hasNext;
          this.searchTerm = state.search.filter;
        })
      )
      .subscribe();
  }

  public async showResult({ id }: IScreenshot) {
    await this.router.navigate(['/', 'library', 'screenshots', id]);
  }

  public get count$(): Observable<number> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.search.count));
  }

  public get recents$(): Observable<IScreenshot[]> {
    return this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.search.screenshots));
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
        filter: this.searchTerm,
      })
    );
  }
}
