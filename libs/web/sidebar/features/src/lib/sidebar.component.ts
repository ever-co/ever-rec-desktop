import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import {
    INavigationState,
    selectSidebarState,
    sidebarActions,
} from '@ever-co/sidebar-data-access';
import { Store } from '@ngrx/store';
import { map, Observable, Subject } from 'rxjs';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store, private readonly router: Router) {}

  public get selectedItem$(): Observable<INavigationState> {
    return this.store.select(selectSidebarState).pipe(
      map((state) => {
        return state.selectedItem;
      })
    );
  }

  public get navigationItems$(): Observable<INavigationState[]> {
    return this.store
      .select(selectSidebarState)
      .pipe(map((state) => state.navigationItems));
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
