import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { Store } from '@ngrx/store';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';

@Component({
    selector: 'lib-search',
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  public readonly destroy$ = new Subject<void>();
  @ViewChild('overlayPosition', { static: false })
  public overlay!: CdkOverlayOrigin;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<UIEvent>(window, 'resize')
        .pipe(
          map((event) => (event.target as Window).innerWidth),
          distinctUntilChanged(),
          tap(() => this.ngZone.run(() => this.cdr.detectChanges())),
          takeUntil(this.destroy$)
        )
        .subscribe();
    });

    this.store.dispatch(screenshotActions.loadHistory());
  }

  public get offsetWidth() {
    if (this.overlay) {
      return this.overlay.elementRef.nativeElement.offsetWidth;
    }
  }

  public get searchTerm$(): Observable<string> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.filter),
      takeUntil(this.destroy$)
    );
  }

  public onSearch(searchQuery: string) {
    this.store.dispatch(screenshotActions.filterHistory({ searchQuery }));
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
          this.store.dispatch(
            screenshotActions.addToHistory({ searchQuery: filter })
          );
        }),
        concatMap(() => this.router.navigate(['/', 'search'])),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get isLoading$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.loading),
      takeUntil(this.destroy$)
    );
  }

  public overlayOpen(isOpen: boolean) {
    this.store.dispatch(screenshotActions.overlayClicked({ isOpen }));
  }

  public get overlayOpen$(): Observable<boolean> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.search.overlayOpen),
      takeUntil(this.destroy$)
    );
  }
}
