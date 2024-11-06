// screenshot-statistics-chart.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { NoDataComponent } from '@ever-co/shared-components';
import { IScreenshotMetadataStatistic } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable, Subject, map, takeUntil } from 'rxjs';

interface BarChartData {
  name: string;
  value: number;
  tooltipText?: string; // Added for custom tooltip formatting
}

interface LineChartData {
  name: string;
  series: { name: string; value: number }[];
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
export class ScreenshotStatisticsChartComponent implements OnDestroy {
  public readonly chartTypes: ChartType[] = ['bar', 'line'];
  public selectedChartType: ChartType = 'bar';
  public destroy$ = new Subject<void>();

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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get chartData$(): Observable<ChartData[]> {
    return this.store.select(selectScreenshotState).pipe(
      map((state) => state.statistic.currents || []), // Ensure we always have an array
      map((data) => this.prepareChartData(data)),
      takeUntil(this.destroy$)
    );
  }

  selectChartType(type: ChartType): void {
    this.selectedChartType = type;
  }

  private prepareChartData(data: IScreenshotMetadataStatistic[]): ChartData[] {
    if (!data?.length) return [];

    return this.selectedChartType === 'bar'
      ? this.prepareBarChartData(data)
      : this.prepareLineChartData(data);
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

  private prepareLineChartData(
    data: IScreenshotMetadataStatistic[]
  ): LineChartData[] {
    return [
      {
        name: 'Trend',
        series: data.map((item) => ({
          name: item.name || 'Unnamed',
          value: Number(item.trend) || 0, // Ensure we have a number
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
      ${isSelected ? 'bg-gradient-to-r from-indigo-600 to-indigo-400 text-white' : 'bg-gray-200 text-black'}
      hover:bg-indigo-500 hover:text-white focus:outline-none transition-colors duration-200
    `.trim();
  }
}
