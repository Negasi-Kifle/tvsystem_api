/**
 * Tool result shape for `getRevenueByAdvertPackageChart` (AI Insight).
 * Sent to clients via the Vercel AI UI message stream (tool output parts).
 */
export type InsightChartType = 'bar' | 'pie' | 'line';

export type InsightChartDataPoint = {
  label: string;
  value: number;
};

export type AdvertPackageRevenueChartPayload = {
  chartType: InsightChartType;
  title: string;
  valueUnit: 'ETB';
  /** Calendar month (YYYY-MM) for the aggregation window. */
  month: string;
  points: InsightChartDataPoint[];
};
