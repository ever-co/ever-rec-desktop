export const SCREENSHOT_INTERVAL_DELAY = 2000;
// Mathematical Constants Configuration
export const STATISTICAL_CONSTANTS = {
  Z_95_CONFIDENCE: 1.96, // 95% normal confidence interval
  MIN_SAMPLE_RATE: 0.05, // Minimum sampling density
  MAX_SAMPLE_RATE: 1.0, // Maximum sampling density
  EFFECT_SIZE_NORMALIZATION: 4.0, // Scaling factor for Cohen's d
  TREND_STABILITY_EPSILON: 1e-10, // Numerical stability constant
  MINIMUM_OBSERVATIONS: 5, // Minimum samples for reliable statistics
  SEASONAL_COMPARISON_THRESHOLD: 360, // Days for seasonal adjustment
  WEEKLY_CADENCE_OFFSET: 7, // Days for weekly comparison
  YEARLY_CADENCE_OFFSET: 366, // Days for yearly comparison
  MAX_TREND_MAGNITUDE: 10000, // Bound for trend normalization
  PAGINATION_MAX_LIMIT: 1000, // Maximum records per page
  DEFAULT_PAGINATION_LIMIT: 10, // Default records per page
};

export const API_PREFIX = '/api/v1'; // Api prefix
