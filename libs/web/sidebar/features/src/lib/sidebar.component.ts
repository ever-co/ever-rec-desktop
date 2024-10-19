import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import {
  INavigationState,
  selectSidebarState,
  SidebarActions,
} from '@ever-co/sidebar-data-access';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  selectedItem$: Observable<INavigationState>;
  navigationItems$: Observable<INavigationState[]>;

  constructor(private readonly store: Store, private readonly router: Router) {
    const sidebarState$ = this.store.select(selectSidebarState);
    this.selectedItem$ = sidebarState$.pipe(map((state) => state.selectedItem));
    this.navigationItems$ = sidebarState$.pipe(
      map((state) => state.navigationItems)
    );
  }

  public async onSelect(selectedItem: INavigationState) {
    this.store.dispatch(SidebarActions.selectNavigationItem({ selectedItem }));
    await this.router.navigate([selectedItem.route]);
  }
}
