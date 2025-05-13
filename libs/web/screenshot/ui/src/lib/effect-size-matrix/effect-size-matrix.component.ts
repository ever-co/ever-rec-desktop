import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IStatisticalResult } from '@ever-co/shared-utils';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'lib-effect-size-matrix',
  imports: [NgxChartsModule],
  templateUrl: './effect-size-matrix.component.html',
  styleUrls: ['./effect-size-matrix.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectSizeMatrixComponent implements OnChanges {
  @Input() data: IStatisticalResult[] = [];

  // Chart configuration
  view: [number, number] = [700, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = "Effect Size (Cohen's d)";
  showYAxisLabel = true;
  yAxisLabel = 'Confidence Level';
  showGridLines = true;
  roundDomains = true;
  maxRadius = 20;
  minRadius = 5;

  colorScheme: Color = {
    domain: ['#ef4444', '#f97316', '#d1d5db', '#22c55e', '#16a34a'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Effect Size',
  };

  processedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.processData();
    }
  }

  private processData(): void {
    if (!this.data || this.data.length === 0) {
      this.processedData = [];
      return;
    }

    // Filter out invalid data points
    const validData = this.data.filter(
      (item) =>
        !isNaN(item?.effectSize || 0) &&
        !isNaN(item?.confidence || 0) &&
        !isNaN(item.count) &&
        item.count > 0,
    );

    if (validData.length === 0) {
      this.processedData = [];
      return;
    }

    const minCount = Math.min(...validData.map((d) => d.count));
    const maxCount = Math.max(...validData.map((d) => d.count));

    this.processedData = validData.map((item) => ({
      name: item.name,
      series: [
        {
          name: item.name,
          x: Number((item.effectSize || 0).toFixed(2)),
          y: Number((item.confidence || 0).toFixed(2)),
          r: this.calculateBubbleSize(item.count, minCount, maxCount),
        },
      ],
    }));
  }

  private calculateBubbleSize(
    count: number,
    minCount: number,
    maxCount: number,
  ): number {
    if (maxCount === minCount) return this.maxRadius;

    const normalized = (count - minCount) / (maxCount - minCount);
    return this.minRadius + normalized * (this.maxRadius - this.minRadius);
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.35, 500];
  }
}
