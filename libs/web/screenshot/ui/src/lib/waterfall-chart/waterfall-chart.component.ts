import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IStatisticalResult } from '@ever-co/shared-utils';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'lib-waterfall-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterfallChartComponent implements OnChanges {
  @Input() data: IStatisticalResult[] = [];
  @Input() view: [number, number] = [800, 500];
  @Input() showLegendBelow = true;

  // Chart configuration
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false; // We'll handle legend separately in template
  showXAxisLabel = true;
  xAxisLabel = 'Metrics';
  showYAxisLabel = true;
  yAxisLabel = 'Trend (%)';
  showGridLines = true;
  barPadding = 20;
  roundDomains = false;
  animations = true;

  // Color definitions
  private readonly colorMap = {
    strongIncrease: '#16a34a',
    moderateIncrease: '#22c55e',
    neutral: '#d1d5db',
    moderateDecrease: '#f97316',
    strongDecrease: '#ef4444',
  };

  processedData: any[] = [];
  colorScheme: Color = {
    name: 'waterfall',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: Object.values(this.colorMap),
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['view']) {
      this.processData();
    }
  }

  private processData(): void {
    if (!this.data || this.data.length === 0) {
      this.processedData = [];
      return;
    }

    this.processedData = this.data
      .filter((item) => item.trend !== undefined && item.trend !== null)
      .sort((a, b) => (b.trend || 0) - (a.trend || 0))
      .map((item) => ({
        name: item.name,
        value: this.formatTrendValue(item.trend || 0),
        extra: {
          confidence: item.confidence ?? 0,
          count: item.count ?? 0,
        },
        color: this.getColorForTrend(item.trend || 0),
      }));
  }

  private formatTrendValue(trend: number): number {
    return Math.round(trend * 100 * 10) / 10; // Round to 1 decimal place
  }

  private getColorForTrend(trend: number): string {
    const percentage = trend * 100;
    if (percentage > 50) return this.colorMap.strongIncrease;
    if (percentage > 20) return this.colorMap.moderateIncrease;
    if (percentage < -50) return this.colorMap.strongDecrease;
    if (percentage < -20) return this.colorMap.moderateDecrease;
    return this.colorMap.neutral;
  }

  public customTooltipText({ name, value, extra }: any): string {
    return `
      <div class="font-bold text-lg">${name}</div>
      <div>Trend: ${value.toFixed(1)}%</div>
      ${extra.confidence ? `<div>Confidence: ${(extra.confidence * 100).toFixed(0)}%</div>` : ''}
      ${extra.count ? `<div>Count: ${extra.count.toLocaleString()}</div>` : ''}
    `;
  }

  public yAxisTickFormatting(val: number): string {
    return `${val}%`;
  }
}
