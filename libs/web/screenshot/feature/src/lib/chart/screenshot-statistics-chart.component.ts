import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { IScreenshotMetadataStatistic } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lib-screenshot-statistics-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, NoDataComponent],
  templateUrl: './screenshot-statistics-chart.component.html',
  styleUrls: ['./screenshot-statistics-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotStatisticsChartComponent implements OnInit {
  barChartData$!: Observable<{ name: string; value: number }[]>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.barChartData$ = this.store.select(selectScreenshotState).pipe(
      map((state) => state.statistic.currents),
      map((data) => this.prepareChartData(data))
    );
  }

  private prepareChartData(data: IScreenshotMetadataStatistic[]) {
    // Prepare pie chart data for usage
    return data.map((d) => ({
      name: d.name,
      value: (d.count * 100) / d.total,
    }));
  }
}
