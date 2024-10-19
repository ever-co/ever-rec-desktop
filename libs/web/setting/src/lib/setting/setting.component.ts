import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { Store } from '@ngrx/store';
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
export class SettingComponent {
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
  }

  public async change(link: ILink): Promise<void> {
    this.activeLink = link;
    await this.router.navigate([link]);
  }
}
