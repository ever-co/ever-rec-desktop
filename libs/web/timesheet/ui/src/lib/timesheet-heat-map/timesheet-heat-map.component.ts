import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DataStrategyFactory } from './services/data-factory.service';

@Component({
  selector: 'lib-timesheet-heat-map',
  standalone: true,
  imports: [NgxChartsModule],
  providers: [DataStrategyFactory],
  templateUrl: './timesheet-heat-map.component.html',
  styleUrls: ['./timesheet-heat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetHeatMapComponent implements OnChanges {
  @Input() data: ITimeLog[] | null = [];
  @Input() view: [number, number] | undefined;

  // Calculated dimensions based on container size
  chartWidth: number = 0;
  chartHeight: number = 0;

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
  chartData: IHeatMapDataPoint[] = [];

  constructor(
    private elementRef: ElementRef,
    private readonly factory: DataStrategyFactory,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartData();
    }
    this.updateChartDimensions();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateChartDimensions();
  }

  private updateChartDimensions(): void {
    if (this.view) {
      // Use provided dimensions if available
      [this.chartWidth, this.chartHeight] = this.view;
    } else {
      // Calculate responsive dimensions based on parent container
      const parentElement = this.elementRef.nativeElement.parentElement;
      if (parentElement) {
        // Get the parent width and calculate height (minimum 400px for readability)
        this.chartWidth = parentElement.clientWidth;
        this.chartHeight = Math.max(400, parentElement.clientHeight);

        // Adjust legend visibility based on available width
        this.showLegend = this.chartWidth >= 500;
      }
    }
  }

  private updateChartData(): void {
    // Use the factory to get the appropriate strategy based on data
    const strategy = this.factory.createStrategy(this.data);

    // Update axis labels based on the strategy
    this.xAxisLabel = strategy.getXAxisLabel();
    this.yAxisLabel = strategy.getYAxisLabel();

    // Process data using the strategy
    this.chartData = strategy.processData(this.data);
  }

  public tooltipText({ cell }: any): string {
    return `${cell.series} - ${cell.name}: ${moment.duration(cell.value, 'h').format('h[h] m[m] s[s]')}`;
  }
}
