import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IStatisticalResult } from '@ever-co/shared-utils';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
  selector: 'lib-power-analysis-graph',
  standalone: true,
  imports: [NgxChartsModule, MatIconModule, MatTooltipModule],
  templateUrl: './power-analysis-graph.component.html',
  styleUrl: './power-analysis-graph.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PowerAnalysisGraphComponent implements OnChanges {
  @Input() data: IStatisticalResult[] = [];

  // Chart configuration
  view: [number, number] = [700, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Application';
  showYAxisLabel = true;
  yAxisLabel = 'Statistical Power';
  showGridLines = true;
  autoScale = true;
  roundDomains = true;
  curve = shape.curveMonotoneX;

  referenceLine = {
    value: 40,
    name: '80% Power Threshold',
    color: '#ef4444',
    strokeDashArray: '5,5',
  };

  colorScheme: Color = {
    name: 'powerAnalysis',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6'],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.processedData();
    }
  }

  public processedData() {
    return [
      {
        name: 'Power Analysis',
        series: this.data.map((item) => ({
          name: item.name,
          value: (item.statisticalPower || 0) * 100,
          extra: {
            power: item.statisticalPower,
            count: item.count / 100,
          },
        })),
      },
    ];
  }

  public yAxisTickFormatting(val: number): string {
    return `${Math.round(val)}%`;
  }

  public customTooltipText({ seriesName, name, value, extra }: any): string {
    return `
      <div class="tooltip-container">
        <div class="font-semibold text-blue-600">${seriesName}</div>
        <div class="tooltip-content mt-1">
          <div><span class="font-medium">Metric:</span> ${name}</div>
          <div><span class="font-medium">Sample Size:</span> ${value}</div>
          <div><span class="font-medium">Power:</span> ${extra.power.toFixed(1)}%</div>
          <div><span class="font-medium">Count:</span> ${extra.count}</div>
        </div>
      </div>
    `;
  }
}
