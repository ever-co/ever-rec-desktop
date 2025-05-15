import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { NoDataComponent } from '@ever-co/shared-components';
import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import {
  BehaviorSubject,
  debounceTime,
  EMPTY,
  fromEvent,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { DataStrategyFactory } from './services/data-factory.service';
import { DailyDataWorkerStrategy } from './strategies/daily-data-worker.strategy';
import { DailyDataStrategy } from './strategies/daily-data.strategy';
import { HourlyDataWorkerStrategy } from './strategies/hourly-data-worker.strategy';
import { HourlyDataStrategy } from './strategies/hourly-data.strategy';

@Component({
  selector: 'lib-timesheet-heat-map',
  standalone: true,
  imports: [NgxChartsModule, NoDataComponent],
  templateUrl: './timesheet-heat-map.component.html',
  styleUrls: ['./timesheet-heat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetHeatMapComponent implements OnChanges, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly factory = inject(DataStrategyFactory);
  private destroyed$ = new Subject<void>();

  @Input() data: ITimeLog[] | null = [];
  @Input() view: [number, number] | undefined;
  @Input() minHeight = 270; // Minimum height in pixels
  @Input() minWidth = 890; // Minimum width in pixels
  @Input() aspectRatio = 128 / 37; // Width to height ratio
  @Input() margin: [number, number, number, number] = [10, 10, 10, 20]; // [top, right, bottom, left]

  // Heatmap options
  legend = false;
  showLegend = false;
  legendTitle = 'Hours';
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = false;
  yAxisLabel = 'Hour of Day';
  showXAxisLabel = false;
  xAxisLabel = 'Day of Week';
  gradient = false;
  maxXAxisTickLength = 12;

  // Color scheme with accessibility in mind - higher contrast
  colorScheme = {
    name: 'timesheetHeatMap',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: ['#f0f0f0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  };

  // Processed data for the chart
  chartData$ = new BehaviorSubject<IHeatMapDataPoint[]>([]);

  // Chart dimensions with initial values
  chartWidth = 0;
  chartHeight = 0;

  ngOnInit() {
    // Use RxJS for more efficient resize handling
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroyed$))
      .subscribe(() => this.updateChartDimensions());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartData()
        .pipe(
          tap(() => this.updateChartDimensions()),
          takeUntil(this.destroyed$),
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private updateChartDimensions(): void {
    if (this.view) {
      // Use provided dimensions if available
      [this.chartWidth, this.chartHeight] = this.view;
    } else {
      // Calculate responsive dimensions based on parent container
      const parentElement = this.elementRef.nativeElement.parentElement;
      if (parentElement) {
        const parentWidth = parentElement.clientWidth;

        // Calculate width considering margins
        let availableWidth = Math.max(
          parentWidth - this.margin[1] - this.margin[3],
        );

        if (availableWidth < this.minWidth) {
          availableWidth = this.minWidth;
        }

        // Calculate height based on aspect ratio, but not less than minHeight
        const calculatedHeight = availableWidth / this.aspectRatio;
        this.chartHeight = Math.max(this.minHeight, calculatedHeight);
        this.chartWidth = availableWidth;

        // Adjust legend visibility based on available width
        this.showLegend = availableWidth >= 500;
      }
    }
  }

  private updateChartData(): Observable<void> {
    if (!this.data || this.data.length === 0) {
      this.chartData$.next([]);
      return EMPTY;
    }

    // Use the factory to get the appropriate strategy based on data
    const strategy = this.factory.createStrategy(this.data);

    // Update axis labels based on the strategy
    this.xAxisLabel = strategy.getXAxisLabel();
    this.yAxisLabel = strategy.getYAxisLabel();

    // Process data using the strategy
    return strategy.processData(this.data).pipe(
      take(1),
      map((data) => {
        this.chartData$.next(data);

        if (
          strategy instanceof DailyDataStrategy ||
          strategy instanceof DailyDataWorkerStrategy
        ) {
          this.aspectRatio = 4 / 3;
        }

        if (
          strategy instanceof HourlyDataStrategy ||
          strategy instanceof HourlyDataWorkerStrategy
        ) {
          this.aspectRatio = 128 / 37;
        }

        return;
      }),
    );
  }

  public tooltipText({ cell }: any): string {
    if (!cell?.value) return 'No work';
    return `${cell.series} - ${cell.name}: ${moment.duration(cell.value, 'h').format('h[h] m[m] s[s]')}`;
  }

  get chartView(): [number, number] {
    return [this.chartWidth, this.chartHeight];
  }
}
