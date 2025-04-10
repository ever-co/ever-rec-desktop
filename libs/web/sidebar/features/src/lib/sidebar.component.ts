import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { LayoutService } from '@ever-co/shared-service';
import {
  INavigationState,
  selectSidebarState,
  sidebarActions,
} from '@ever-co/sidebar-data-access';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
    selector: 'lib-sidebar',
    imports: [CommonModule, MatListModule, MatIconModule, MatTooltipModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly layoutService: LayoutService
  ) {
    this.router.events
      .pipe(
        map((evt) => (evt as NavigationEnd).urlAfterRedirects),
        filter(Boolean),
        distinctUntilChanged(),
        tap((route) => this.store.dispatch(sidebarActions.navigate({ route }))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get selectedItem$(): Observable<INavigationState> {
    return this.store.select(selectSidebarState).pipe(
      map((state) => {
        return state.selectedItem;
      }),
      takeUntil(this.destroy$)
    );
  }

  public get navigationItems$(): Observable<INavigationState[]> {
    return this.store.select(selectSidebarState).pipe(
      map((state) => state.navigationItems),
      takeUntil(this.destroy$)
    );
  }

  public async onSelect(selectedItem: INavigationState) {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: selectedItem.title, url: selectedItem.route }],
      })
    );
    this.store.dispatch(sidebarActions.selectNavigationItem({ selectedItem }));
    await this.router.navigate([selectedItem.route]);
  }

  public get isTabletView() {
    return this.layoutService.isTabletView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
