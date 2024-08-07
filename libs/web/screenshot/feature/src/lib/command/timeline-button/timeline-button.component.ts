import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { breadcrumbActions } from '@ever-capture/breadcrumb/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-timeline-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-button.component.html',
  styleUrl: './timeline-button.component.scss',
})
export class TimelineButtonComponent {
  private readonly store = inject(Store);
  // Using readonly property to enforce immutability
  private readonly router = inject(Router);

  // Use more descriptive variable name for the title
  public pageTitle = 'Timeline';

  // Adding explicit return type for better type safety
  public async navigateToVideo(): Promise<void> {
    const url = '/timeline';
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [
          { label: 'home', url: '/' },
          { label: this.pageTitle, url },
        ],
      })
    );

    // Navigate to the desired route
    await this.router.navigate([url]);
  }
}
