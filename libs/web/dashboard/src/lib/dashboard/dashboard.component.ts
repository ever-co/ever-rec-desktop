import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { selectGenerateVideoState } from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, NoDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit{
  public capturing$!: Observable<boolean>;
  public generating$!: Observable<boolean>;
  public screenshotCount$!: Observable<number>;

  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(map(state => state.capturing));
    this.screenshotCount$ = this.store.select(selectScreenshotState).pipe(map(state => state.count));
    this.generating$ = this.store.select(selectGenerateVideoState).pipe(map(state => state.generating));
  }
}
