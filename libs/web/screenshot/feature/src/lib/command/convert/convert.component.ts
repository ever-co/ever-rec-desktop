import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { breadcrumbActions } from '@ever-capture/breadcrumb-data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-convert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'], // Renamed to 'styleUrls' for consistency with Angular convention
})
export class ConvertComponent {
  private readonly store = inject(Store);
  // Using readonly property to enforce immutability
  private readonly router = inject(Router);

  // Use more descriptive variable name for the title
  public pageTitle = 'settings';

  // Adding explicit return type for better type safety
  public async navigateToVideo(): Promise<void> {
    // Optimize route navigation by using a single ternary operation
    const route = 'convert';

    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [
          { label: 'home', url: '/' },
          { label: this.pageTitle, url: route },
        ],
      })
    );

    // Navigate to the desired route
    await this.router.navigate([route]);
  }
}
