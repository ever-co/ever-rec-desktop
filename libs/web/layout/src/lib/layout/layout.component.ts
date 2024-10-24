import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { BreadcrumbComponent } from '@ever-co/breadcrumb-feature';
import { DatePickerComponent, StartComponent } from '@ever-co/shared-components';
import { SidebarComponent } from '@ever-co/sidebar-feature';
import { SearchComponent } from '@ever-co/web-search';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    SidebarComponent,
    RouterOutlet,
    SearchComponent,
    StartComponent,
    DatePickerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public isExpanded = false;
  public isMobileView = false;
  constructor(
    private readonly store: Store,
    private readonly breakpointObserver: BreakpointObserver
  ) {}
  public ngOnInit(): void {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'Dashboard', url: 'dashboard' }],
      })
    );
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobileView = result.matches;
        this.isExpanded = !this.isMobileView;
      });
  }

  public toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  public ngOnDestroy(): void {
    // Complete the destroy$ observable to unsubscribe all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
