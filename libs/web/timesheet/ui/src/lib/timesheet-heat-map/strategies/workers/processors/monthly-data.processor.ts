import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { DateService } from '../../../services/date.service';
import { DataProcessor } from '../interfaces/data.interface';

export class MonthlyDataProcessor implements DataProcessor {
  execute(logs: ITimeLog[]): IHeatMapDataPoint[] {
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
      if (!log.start) return;

      const startMoment = moment(log.start);

      let endMoment: moment.Moment;
      if (log.end) {
        endMoment = moment(log.end);
      } else {
        endMoment = moment();
      }

      // Ensure end is after start
      if (endMoment.isBefore(startMoment)) {
        return;
      }

      // Handle logs that span multiple days
      let currentMoment = moment(startMoment);
      while (currentMoment.isBefore(endMoment)) {
        const currentDateKey = DateService.formatDateLabel(currentMoment);
        const currentDayOfWeek = DateService.getDayName(currentMoment);

        // Calculate end of current day
        const dayEnd = moment(currentMoment).endOf('day');
        const segmentEnd = moment.min(endMoment, dayEnd);

        // Calculate duration in this segment in hours
        const segmentDuration = moment
          .duration(segmentEnd.diff(currentMoment))
          .asHours();

        // Initialize the date if it doesn't exist in our map
        if (!dateMap.has(currentDateKey)) {
          dateMap.set(currentDateKey, new Map<string, number>());
        }

        // Get the day map for this date
        const dayMap = dateMap.get(currentDateKey)!;

        // Add the duration to the day
        dayMap.set(
          currentDayOfWeek,
          (dayMap.get(currentDayOfWeek) || 0) + segmentDuration,
        );

        // Move to next day
        currentMoment = segmentEnd;
      }
    });

    // Convert the map data to our heatmap format
    heatmapData.forEach((dayData) => {
      dateMap.forEach((dayHours, dateKey) => {
        const hours = dayHours.get(dayData.name) || 0;
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
}
