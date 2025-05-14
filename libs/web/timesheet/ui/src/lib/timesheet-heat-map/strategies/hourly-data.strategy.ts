import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { DateService } from '../services/date.service';

export class HourlyDataStrategy implements DataProcessingStrategy {
  public processData(logs: ITimeLog[]): IHeatMapDataPoint[] {
    // Initialize heatmap with hours as rows and days of week as columns
    const heatmapData = Array.from({ length: 24 }, (_, i) => ({
      name: DateService.formatHourLabel(i),
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

    if (!logs || logs.length === 0) {
      return heatmapData;
    }

    logs.forEach((log) => {
      if (log.start) {
        const startMoment = moment(log.start);
        const dayOfWeek = DateService.getDayName(startMoment);
        const hourOfDay = startMoment.hour();

        // Calculate duration using moment
        let durationHours = 0;
        if (log.duration) {
          durationHours = DateService.durationToHours(log.duration);
        } else if (log.end) {
          const endMoment = moment(log.end);
          durationHours = moment
            .duration(endMoment.diff(startMoment))
            .asHours();
        }

        // Find the corresponding hour in our heatmap data
        const hourData = heatmapData.find(
          (d) => d.name === DateService.formatHourLabel(hourOfDay),
        );

        if (hourData) {
          // Find the corresponding day in the hour's series
          const dayData = hourData.series.find((s) => s.name === dayOfWeek);

          if (dayData) {
            dayData.value += durationHours;
          }
        }
      }
    });

    return heatmapData;
  }

  public getXAxisLabel(): string {
    return 'Day of Week';
  }

  public getYAxisLabel(): string {
    return 'Hour of Day';
  }
}
