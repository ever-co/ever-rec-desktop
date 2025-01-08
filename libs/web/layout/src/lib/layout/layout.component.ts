// layout.component.ts
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { BreadcrumbComponent } from '@ever-co/breadcrumb-feature';
import { NotificationBadgeComponent } from '@ever-co/notification-feature';
import { UploadProgressComponent } from '@ever-co/upload-feature';
import {
  DatePickerComponent,
  StartComponent,
} from '@ever-co/shared-components';
import { LayoutService } from '@ever-co/shared-service';
import { SidebarComponent } from '@ever-co/sidebar-feature';
import { SearchComponent } from '@ever-co/web-search';
import { Store } from '@ngrx/store';
import {
  map,
  Observable,
  Subject,
  takeUntil,
  filter,
  tap,
  exhaustMap,
  of,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { selectUploadState } from '@ever-co/upload-data-access';
import { NotificationService } from '@ever-co/notification-data-access';

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
    DatePickerComponent,
    MatTooltipModule,
    NotificationBadgeComponent,
    UploadProgressComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private snackbarRef: MatSnackBarRef<UploadProgressComponent> | null = null;

  constructor(
    private readonly store: Store,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly notificationService: NotificationService,
    private readonly layoutService: LayoutService
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'Dashboard', url: 'dashboard' }],
      })
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

    this.uploading$
      .pipe(
        distinctUntilChanged(),
        tap((uploading) => {
          if (uploading && !this.snackbarRef) {
            this.notificationService.show('Upload started', 'success', {
              component: UploadProgressComponent,
              afterOpened: (snackbarRef) => {
                if (!snackbarRef) {
                  return;
                }
                this.snackbarRef = snackbarRef;
              },
            });
          }

          if (this.snackbarRef && !uploading) {
            this.snackbarRef.dismiss();
            this.snackbarRef = null;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get uploading$(): Observable<boolean> {
    return this.store.select(selectUploadState).pipe(
      debounceTime(150),
      map((state) => state.uploading)
    );
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
