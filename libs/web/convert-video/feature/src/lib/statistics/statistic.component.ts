import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-capture/screenshot-data-access';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'lib-statistic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss',
})
export class StatisticComponent implements OnInit {
  private readonly store = inject(Store);
  public count$!: Observable<number>;
  ngOnInit(): void {
    this.count$ = this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.screenshots.length));
  }

  public deleteAll() {
    this.store.dispatch(screenshotActions.deleteScreenshots());
  }
}
