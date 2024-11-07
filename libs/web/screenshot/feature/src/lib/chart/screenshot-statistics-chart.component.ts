// screenshot-statistics-chart.component.ts
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  screenshotActions,
  selectScreenshotState,
} from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import {
  IScreenshot,
  IScreenshotChartLine,
  IScreenshotMetadataStatistic,
} from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { Observable, Subject, map, takeUntil } from 'rxjs';

interface IScreenshotGroup {
  hour: string;
  screenshots: IScreenshot[];
}

interface BarChartData {
  name: string;
  value: number;
  tooltipText?: string; // Added for custom tooltip formatting
}

interface LineChartData {
  name: string;
  series: { value: number; name: string | Date | undefined }[];
}

type ChartData = BarChartData | LineChartData;
type ChartType = 'bar' | 'line';

@Component({
  selector: 'lib-screenshot-statistics-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, NoDataComponent],
  templateUrl: './screenshot-statistics-chart.component.html',
  styleUrls: ['./screenshot-statistics-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotStatisticsChartComponent implements OnInit, OnDestroy {
  public readonly chartTypes: ChartType[] = ['bar', 'line'];
  public selectedChartType: ChartType = 'bar';
  public destroy$ = new Subject<void>();
  public curveBasis = shape.curveBasis;

  // Common chart configuration
  readonly chartConfig = {
    showXAxis: true,
    showYAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'Applications',
    animations: true,
  };

  // Add formatters for the chart
  yAxisTickFormatting = (val: any) => `${Math.round(val)}%`;

  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.store.dispatch(screenshotActions.getScreenshotsChartLine());
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get chartData$(): Observable<ChartData[]> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) =>
        this.prepareChartData(
          state.statistic.currents || [],
          state.chart.dataLine || []
        )
      ),
      takeUntil(this.destroy$)
    );
  }

  selectChartType(type: ChartType): void {
    this.selectedChartType = type;
  }

  private prepareChartData(
    data: IScreenshotMetadataStatistic[],
    chartLine: IScreenshotChartLine[]
  ): ChartData[] {
    if (!data?.length) return [];
    return this.selectedChartType === 'bar'
      ? this.prepareBarChartData(data)
      : this.prepareLineChartData(chartLine);
  }

  private prepareBarChartData(
    data: IScreenshotMetadataStatistic[]
  ): BarChartData[] {
    return data
      .filter((item) => item.total > 0) // Prevent division by zero
      .map((item) => {
        const percentage = this.calculatePercentage(item.count, item.total);
        return {
          name: item.name || 'Unnamed', // Ensure we always have a name
          value: percentage,
          tooltipText: `${percentage.toFixed(1)}%`,
        };
      });
  }

  private prepareLineChartData(data: IScreenshotChartLine[]): LineChartData[] {
    return [
      {
        name: 'Screenshots',
        series: data.map((item) => ({
          name: item.timeSlot,
          value: item.count,
        })),
      },
    ];
  }

  private calculatePercentage(count: number, total: number): number {
    if (!total) return 0;
    return Math.round((count * 100) / total);
  }

  getButtonClasses(type: ChartType): string {
    const isSelected = this.selectedChartType === type;
    return `
      px-4 py-2
      ${
        type === 'bar'
          ? 'rounded-tl-lg rounded-bl-lg'
          : 'rounded-tr-lg rounded-br-lg'
      }
      ${
        isSelected
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-400 text-white'
          : 'bg-gray-200 text-black'
      }
      hover:bg-indigo-500 hover:text-white focus:outline-none transition-colors duration-200
    `.trim();
  }
}
