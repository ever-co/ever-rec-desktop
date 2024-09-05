import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { breadcrumbActions } from '@ever-co/breadcrumb-data-access';
import { BreadcrumbComponent } from '@ever-co/breadcrumb-feature';
import { Store } from '@ngrx/store';
import { AskComponent } from '../command/ask/ask.component';
import { ConvertComponent } from '../command/convert/convert.component';
import { StartComponent } from '../command/start/start.component';
import { StopComponent } from '../command/stop/stop.component';
import { TimelineButtonComponent } from '../command/timeline-button/timeline-button.component';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [
    CommonModule,
    StartComponent,
    StopComponent,
    ConvertComponent,
    RouterModule,
    BreadcrumbComponent,
    AskComponent,
    TimelineButtonComponent
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
