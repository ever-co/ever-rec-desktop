import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { BreadcrumbComponent } from '@ever-co/breadcrumb-feature';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(
      breadcrumbActions.add({ breadcrumb: { label: 'Home', url: '/' } })
    );
  }
}
