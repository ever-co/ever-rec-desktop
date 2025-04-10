import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IBreadcrumb,
  selectBreadcrumbState,
} from '@ever-co/breadcrumb-data-access';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'lib-breadcrumb',
    imports: [CommonModule, RouterModule],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs$!: Observable<IBreadcrumb[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.store
      .select(selectBreadcrumbState)
      .pipe(map((state) => state.breadcrumbs));
  }
}
