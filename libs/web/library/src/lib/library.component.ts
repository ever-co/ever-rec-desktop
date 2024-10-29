import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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
  selector: 'lib-library',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public links: ILink[] = [
    {
      title: 'Videos',
      route: 'videos',
    },
    {
      title: 'Screenshots',
      route: 'screenshots',
    },
  ];

  public activeLink = this.links[0];

  constructor(private readonly store: Store, private readonly router: Router) {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'My Library', url: '/library' }],
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async change(link: ILink): Promise<void> {
    this.activeLink = link;
    await this.router.navigate([link]);
  }
}
