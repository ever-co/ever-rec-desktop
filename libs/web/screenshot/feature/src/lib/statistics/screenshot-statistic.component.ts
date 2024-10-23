import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { IScreenshotMetadataStatistic } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lib-screenshot-statistic',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './screenshot-statistic.component.html',
  styleUrl: './screenshot-statistic.component.scss',
})
export class ScreenshotStatisticComponent implements OnInit {
  public statistics$!: Observable<IScreenshotMetadataStatistic[]>;

  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.statistics$ = this.store
      .select(selectScreenshotState)
      .pipe(map((state) => state.statistics));
  }

  public calculateProgress(count: number, total: number): number {
    return total > 0 ? (count / total) * 100 : 0;
  }

  public getColor(percentage: number) {
    if (percentage < 50) {
      return 'warn';
    } else if (percentage < 75) {
      return 'accent';
    } else {
      return 'primary';
    }
  }
}
