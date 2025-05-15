import { IHeatMapDataPoint, ITimeLog, moment } from '@ever-co/shared-utils';
import { DataProcessingStrategy } from '../models/data-processing.strategy';
import { DateService } from '../services/date.service';

export class DailyDataStrategy implements DataProcessingStrategy {
  public processData(logs: ITimeLog[]): IHeatMapDataPoint[] {
    if (!logs?.length) {
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
      currentDate.add(1, 'day');
    }

    // Process logs
    for (const log of logs) {
      if (!log.start) continue;

      const startMoment = moment(log.start);
      const startDateKey = DateService.formatDateLabel(startMoment);

      let endMoment: moment.Moment;
      if (log.end) {
        endMoment = moment(log.end);
      } else {
        endMoment = moment();
      }

      // Handle invalid logs (end before start)
      if (endMoment.isBefore(startMoment)) {
        continue;
      }

      // If the log is within the same day
      if (startMoment.isSame(endMoment, 'day')) {
        this.processSingleDayLog(
          dateHourMap,
          startMoment,
          endMoment,
          startDateKey,
        );
        continue;
      }

      // For logs spanning multiple days
      this.processMultiDayLog(dateHourMap, startMoment, endMoment);
    }

    // Convert map to heatmap format
    return this.convertMapToHeatmap(dateHourMap);
  }

  private processSingleDayLog(
    dateHourMap: Map<string, Map<number, number>>,
    startMoment: moment.Moment,
    endMoment: moment.Moment,
    dateKey: string,
  ): void {
    const hourMap = dateHourMap.get(dateKey);
    if (!hourMap) return;

    let currentMoment = moment(startMoment);
    while (currentMoment.isBefore(endMoment)) {
      const hourEnd = moment(currentMoment).endOf('hour');
      const segmentEnd = moment.min(hourEnd, endMoment);

      const durationHours = moment
        .duration(segmentEnd.diff(currentMoment))
        .asHours();
      const hour = currentMoment.hour();

      hourMap.set(hour, (hourMap.get(hour) || 0) + durationHours);
      currentMoment = moment(segmentEnd).add(1, 'millisecond');
    }
  }

  private processMultiDayLog(
    dateHourMap: Map<string, Map<number, number>>,
    startMoment: moment.Moment,
    endMoment: moment.Moment,
  ): void {
    let currentMoment = moment(startMoment);

    while (currentMoment.isBefore(endMoment)) {
      const currentDateKey = DateService.formatDateLabel(currentMoment);
      const hourMap = dateHourMap.get(currentDateKey);
      if (!hourMap) {
        currentMoment.add(1, 'day').startOf('day');
        continue;
      }

      // Determine end of processing for this day
      const dayEnd = moment(currentMoment).endOf('day');
      const segmentEnd = moment.min(dayEnd, endMoment);

      // Process hours within this day
      while (currentMoment.isBefore(segmentEnd)) {
        const hourEnd = moment(currentMoment).endOf('hour');
        const hourSegmentEnd = moment.min(hourEnd, segmentEnd);

        const durationHours = moment
          .duration(hourSegmentEnd.diff(currentMoment))
          .asHours();
        const hour = currentMoment.hour();

        hourMap.set(hour, (hourMap.get(hour) || 0) + durationHours);
        currentMoment = moment(hourSegmentEnd).add(1, 'millisecond');
      }

      // Move to next day if needed
      if (currentMoment.isSameOrAfter(dayEnd)) {
        currentMoment.startOf('day').add(1, 'day');
      }
    }
  }

  private convertMapToHeatmap(
    dateHourMap: Map<string, Map<number, number>>,
  ): IHeatMapDataPoint[] {
    const heatmapData: IHeatMapDataPoint[] = [];

    dateHourMap.forEach((hourMap, dateKey) => {
      const series = Array.from(hourMap.entries())
        .sort(([hourA], [hourB]) => hourA - hourB)
        .map(([hour, value]) => ({
          name: DateService.formatHourLabel(hour),
          value,
        }));

      heatmapData.push({
        name: dateKey,
        series,
      });
    });

    // Sort by date
    return heatmapData.sort(
      (a, b) => moment(a.name).valueOf() - moment(b.name).valueOf(),
    );
  }

  public getXAxisLabel(): string {
    return 'Hour of Day';
  }

  public getYAxisLabel(): string {
    return 'Date';
  }
}
