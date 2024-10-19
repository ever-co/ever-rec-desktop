import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { SidebarComponent } from '@ever-co/sidebar-feature';
import { SearchComponent } from '@ever-co/web-search';
import { Store } from '@ngrx/store';

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
    SearchComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit{
  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(
      breadcrumbActions.set({
        breadcrumbs: [{ label: 'Dashboard', url: 'dashboard' }],
      })
    );
  }
}
