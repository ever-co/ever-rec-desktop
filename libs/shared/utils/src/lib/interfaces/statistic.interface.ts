import { IPaginationResponse } from './pagination.interface';

export interface IScreenshotMetadataStatistic {
  name: string;
  icon: string;
  count: number;
  total: number;
  trend?: number;
  confidence?: number;
}

export interface IStatisticalResult extends IScreenshotMetadataStatistic {
  standardError?: number;
  effectSize?: number;
  statisticalPower?: number;
}

export type IPaginationScreenshotStatisticsResponse =
  IPaginationResponse<IStatisticalResult> & {
    confidence: number;
    statisticalPower: number;
  };

export interface ITopApplicationProductivity {
  name: string;
  icon: string;
  totalDuration: number;
  productivityPercent: number;
}
