import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { DateService } from '../services/date.service';

export class DailyDataStrategy implements DataProcessingStrategy {
  public processData(logs: ITimeLog[]): IHeatMapDataPoint[] {
    if (!logs || logs.length === 0) {
      return [];
    }

    // Get date range using moment
    const { start, end } = DateService.calculateDateRange(logs);

    // Create a map to store hours by date
    const dateHourMap = new Map<string, Map<number, number>>();

    // Initialize the map with all dates in range
    const currentDate = moment(start);
    while (currentDate.isSameOrBefore(end, 'day')) {
      const dateKey = DateService.formatDateLabel(currentDate);
      dateHourMap.set(dateKey, new Map());

      // Initialize hours to 0
      for (let hour = 0; hour < 24; hour++) {
        dateHourMap.get(dateKey)?.set(hour, 0);
      }

      // Move to next day
      currentDate.add(1, 'day');
    }

    // Process logs
    logs.forEach((log) => {
      if (log.start) {
        const startMoment = moment(log.start);
        const dateKey = DateService.formatDateLabel(startMoment);
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

        // Add duration to the appropriate hour and date
        const hourMap = dateHourMap.get(dateKey);
        if (hourMap) {
          hourMap.set(hourOfDay, (hourMap.get(hourOfDay) || 0) + durationHours);
        }
      }
    });

    // Convert map to heatmap format
    const heatmapData: IHeatMapDataPoint[] = [];

    // For each date
    dateHourMap.forEach((hourMap, dateKey) => {
      const dataPoint: IHeatMapDataPoint = {
        name: dateKey,
        series: [],
      };

      // For each hour
      hourMap.forEach((value, hour) => {
        dataPoint.series.push({
          name: DateService.formatHourLabel(hour),
          value,
        });
      });

      heatmapData.push(dataPoint);
    });

    return heatmapData;
  }

  public getXAxisLabel(): string {
    return 'Hour of Day';
  }

  public getYAxisLabel(): string {
    return 'Date';
  }
}
