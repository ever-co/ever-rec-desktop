// layout.component.ts
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { AuthBadgeComponent } from '@ever-co/auth-feature';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { BreadcrumbComponent } from '@ever-co/breadcrumb-feature';
import { datePickerActions } from '@ever-co/date-picker-data-access';
import { DatePickerComponent } from '@ever-co/date-picker-feature';
import { NotificationBadgeComponent } from '@ever-co/notification-feature';
import { LayoutService, REC_ENV } from '@ever-co/shared-service';
import { currentWeekTillNow, IEnvironment } from '@ever-co/shared-utils';
import { SidebarComponent } from '@ever-co/sidebar-feature';
import { UploadBadgeComponent } from '@ever-co/upload-feature';
import { SearchComponent } from '@ever-co/web-search';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { StartComponent } from '../start/start.component';

@Component({
  selector: 'lib-layout',
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
    DatePickerComponent,
    MatTooltipModule,
    NotificationBadgeComponent,
    UploadBadgeComponent,
    AuthBadgeComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly layoutService: LayoutService,
    @Inject(REC_ENV)
    public readonly env: IEnvironment,
  ) {
    this.store.dispatch(datePickerActions.selectRange(currentWeekTillNow()));
  }

  public ngOnInit(): void {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'Dashboard', url: 'dashboard' }],
      }),
    );

    this.breakpointObserver
      .observe([
        '(max-width: 767px)',
        '(min-width: 768px) and (max-width: 1024px)',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const isMobile = result.breakpoints['(max-width: 767px)'];
        const isTablet =
          result.breakpoints['(min-width: 768px) and (max-width: 1024px)'];

        this.layoutService.updateViewports({
          isMobile,
          isTablet,
          isExpanded: !isMobile || isTablet,
        });
      });
  }

  public get isExpanded(): boolean {
    return this.layoutService.isExpanded();
  }

  public set isExpanded(value: boolean) {
    this.layoutService.isExpanded.set(value);
  }

  public get isMobileView(): boolean {
    return this.layoutService.isMobileView();
  }

  public get isTablet(): boolean {
    return this.layoutService.isTabletView();
  }

  public toggleSidenav(): void {
    this.layoutService.isExpanded.set(!this.isExpanded);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
