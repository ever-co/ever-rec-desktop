import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { DateService } from '../services/date.service';

export class MonthlyDataStrategy implements DataProcessingStrategy {
  processData(logs: ITimeLog[]): IHeatMapDataPoint[] {
    if (!logs || logs.length === 0) {
      return [];
    }

    // Reorder days to have Monday first (1-7 for Monday to Sunday)
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    // Initialize heatmap data with days of week as rows (Y-axis)
    const heatmapData: IHeatMapDataPoint[] = daysOfWeek.map((day) => ({
      name: day,
      series: [], // Will be filled with dates
    }));

    // Create an aggregated map of total hours per date and day of week
    const dateMap = new Map<string, Map<string, number>>();

    // Process all logs and aggregate by date and day of week
    logs.forEach((log) => {
      if (log.start) {
        const startMoment = moment(log.start);
        const dateKey = DateService.formatDateLabel(startMoment);
        const dayOfWeek = DateService.getDayName(startMoment);

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

        // Initialize the date if it doesn't exist in our map
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, new Map<string, number>());
        }

        // Get the day map for this date
        const dayMap = dateMap.get(dateKey)!;

        // Add the duration to the day
        dayMap.set(dayOfWeek, (dayMap.get(dayOfWeek) || 0) + durationHours);
      }
    });

    // Convert the map data to our heatmap format
    // For each day of week (row)
    heatmapData.forEach((dayData) => {
      // For each date we have data for
      dateMap.forEach((dayHours, dateKey) => {
        // Get hours for this day of week, or 0 if none
        const hours = dayHours.get(dayData.name) || 0;

        // Add this date as a column in our data
        dayData.series.push({
          name: dateKey,
          value: hours,
        });
      });

      // Sort the series by date
      dayData.series.sort((a, b) => {
        const dateA = moment(a.name, 'MM/DD');
        const dateB = moment(b.name, 'MM/DD');
        return dateA.valueOf() - dateB.valueOf();
      });
    });

    return heatmapData;
  }

  getXAxisLabel(): string {
    return 'Date';
  }

  getYAxisLabel(): string {
    return 'Day of Week';
  }
}
