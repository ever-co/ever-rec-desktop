import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { Store } from '@ngrx/store';

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
export class LibraryComponent {
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
        breadcrumbs: [
          { label: 'My Library', url: '/library' },
        ],
      })
    );
  }

  public async change(link: ILink): Promise<void> {
    this.activeLink = link;
    await this.router.navigate([link])
  }
}
