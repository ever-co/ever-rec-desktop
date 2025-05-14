import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { ITimeLog, moment } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-timesheet-heat-map',
  standalone: true,
  imports: [NgxChartsModule],
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
  chartData: any[] = [];

  constructor(private elementRef: ElementRef) {}

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
    this.chartData = this.processedData();
  }

  public processedData() {
    // Now grouping by hour of day first, then day of week
    const heatmapData = this.initializeHeatmapData();

    if (!this.data || this.data.length === 0) {
      return heatmapData;
    }

    this.data.forEach((log) => {
      if (log.start) {
        const startDate = new Date(log.start);
        const dayOfWeek = startDate.getDay(); // 0 (Sunday) to 6 (Saturday)
        const hourOfDay = startDate.getHours();

        // Safely calculate duration (handle missing or invalid duration)
        let durationHours = 0;
        if (log.duration) {
          durationHours = log.duration / (60 * 60); // Convert ms to hours
        } else if (log.end) {
          // Calculate from start and end if duration is missing
          const endDate = new Date(log.end);
          durationHours = (endDate.getTime() - startDate.getTime()) / (60 * 60);
        }

        // Find the corresponding hour in our heatmap data
        const hourData = heatmapData.find(
          (d) => d.name === this.formatHourLabel(hourOfDay),
        );
        if (hourData) {
          // Find the corresponding day in the hour's series
          const dayData = hourData.series.find(
            (s) => s.name === this.getDayName(dayOfWeek),
          );
          if (dayData) {
            dayData.value += durationHours;
          }
        }
      }
    });

    return heatmapData;
  }

  private initializeHeatmapData() {
    // Create an entry for each hour of the day (more readable format)
    return Array.from({ length: 24 }, (_, i) => ({
      name: this.formatHourLabel(i),
      series: [
        { name: 'Sunday', value: 0 },
        { name: 'Monday', value: 0 },
        { name: 'Tuesday', value: 0 },
        { name: 'Wednesday', value: 0 },
        { name: 'Thursday', value: 0 },
        { name: 'Friday', value: 0 },
        { name: 'Saturday', value: 0 },
      ],
    }));
  }

  private getDayName(dayIndex: number): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayIndex];
  }

  private formatHourLabel(hour: number): string {
    // Format hours in 12-hour format with AM/PM for better readability
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHour} ${ampm}`;
  }

  public tooltipText({ cell }: any): string {
    return `${cell.series} - ${cell.name}: ${moment.duration(cell.value, 'h').format('h[h] m[m] s[s]')}`;
  }
}
