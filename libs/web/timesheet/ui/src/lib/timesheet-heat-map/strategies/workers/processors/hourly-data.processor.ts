import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { DateService } from '../../../services/date.service';
import { DataProcessor } from '../interfaces/data.interface';

export class HourlyDataProcessor implements DataProcessor {
  private static readonly DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  public execute(logs: ITimeLog[]): IHeatMapDataPoint[] {
    // Initialize heatmap with hours as rows and days of week as columns
    const heatmapData: IHeatMapDataPoint[] = Array.from(
      { length: 24 },
      (_, hour) => ({
        name: DateService.formatHourLabel(hour),
        series: HourlyDataProcessor.DAYS_OF_WEEK.map((day) => ({
          name: day,
          value: 0,
        })),
      }),
    );

    if (!logs?.length) {
      return heatmapData;
    }

    // Create a map for faster access
    const hourMap = new Map<string, Map<string, number>>();
    heatmapData.forEach((hourData) => {
      const dayMap = new Map<string, number>();
      hourData.series.forEach((dayData) => {
        dayMap.set(dayData.name, 0);
      });
      hourMap.set(hourData.name, dayMap);
    });

    for (const log of logs) {
      if (!log.start) continue;

      const startMoment = moment(log.start);
      const dayOfWeek = DateService.getDayName(startMoment);

      let endMoment: moment.Moment;

      if (log.end) {
        endMoment = moment(log.end);
      } else {
        endMoment = moment();
      }

      // Handle case where end is before start (invalid log)
      if (endMoment.isBefore(startMoment)) {
        continue;
      }

      // If the log is within the same hour
      if (
        startMoment.hour() === endMoment.hour() &&
        startMoment.isSame(endMoment, 'day')
      ) {
        const durationHours = moment
          .duration(endMoment.diff(startMoment))
          .asHours();
        this.addDurationToMap(hourMap, startMoment, dayOfWeek, durationHours);
        continue;
      }

      // For logs spanning multiple hours
      let currentMoment = moment(startMoment);
      while (currentMoment.isBefore(endMoment)) {
        const hourEnd = moment(currentMoment).endOf('hour');
        const segmentEnd = moment.min(hourEnd, endMoment);

        const durationHours = moment
          .duration(segmentEnd.diff(currentMoment))
          .asHours();
        this.addDurationToMap(hourMap, currentMoment, dayOfWeek, durationHours);

        currentMoment = moment(segmentEnd).add(1, 'millisecond'); // Move to next time segment
      }
    }

    // Update the original heatmap data with the aggregated values
    heatmapData.forEach((hourData) => {
      const dayMap = hourMap.get(hourData.name);
      hourData.series.forEach((dayData) => {
        dayData.value = dayMap?.get(dayData.name) || 0;
      });
    });

    return heatmapData;
  }

  private addDurationToMap(
    hourMap: Map<string, Map<string, number>>,
    momentTime: moment.Moment,
    dayOfWeek: string,
    durationHours: number,
  ): void {
    const hourOfDay = DateService.formatHourLabel(momentTime.hour());
    const dayMap = hourMap.get(hourOfDay);
    if (dayMap?.has(dayOfWeek)) {
      dayMap.set(dayOfWeek, dayMap.get(dayOfWeek)! + durationHours);
    }
  }
}
