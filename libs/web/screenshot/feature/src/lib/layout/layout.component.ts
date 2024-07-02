import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { breadcrumbActions } from '@prototype/breadcrumb/data-access';
import { BreadcrumbComponent } from '../../../../../breadcrumb/feature/src/lib/breadcrumb/breadcrumb.component';
import { ConvertComponent } from '../command/convert/convert.component';
import { StartComponent } from '../command/start/start.component';
import { StopComponent } from '../command/stop/stop.component';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [
    CommonModule,
    StartComponent,
    StopComponent,
    GalleryComponent,
    ConvertComponent,
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
