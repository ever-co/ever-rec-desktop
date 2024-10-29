import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
interface ILink {
  title: string;
  route: string;
}

@Component({
  selector: 'lib-setting',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatTabsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public links: ILink[] = [
    {
      title: 'Generate Video',
      route: 'generate-video-settings',
    },
    {
      title: 'Screen Capture',
      route: 'screen-capture-settings',
    },
    {
      title: 'Storage',
      route: 'storage',
    },
  ];

  public activeLink = this.links[0];

  constructor(private readonly store: Store, private readonly router: Router) {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'Settings', url: '/settings' }],
      })
    );

    this.router.events
      .pipe(
        map((evt) => (evt as NavigationEnd).urlAfterRedirects),
        filter(Boolean),
        distinctUntilChanged(),
        tap((route) => {
          this.activeLink =
            this.links.find((link) => route.includes(link.route)) ||
            this.links[0];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public async change(link: ILink): Promise<void> {
    this.activeLink = link;
    await this.router.navigate([link]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
