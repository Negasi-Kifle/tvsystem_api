export type KpiCard = {
  value: number;
  changePercent: number;
};

export type AnalyticsKpiSummary = {
  totalRevenue: KpiCard;
  activeShows: KpiCard;
  activeAds: KpiCard;
  totalCustomers: KpiCard;
  conversionRate: KpiCard;
  activeLeads: KpiCard;
};

export type MonthlyRevenueItem = {
  month: number;
  revenue: number;
  target: number;
};

export type TopShowEntry = {
  showId: string;
  title: string;
  type: string;
  revenue: number;
  target: number;
  activeAdsCount: number;
};

export type WeeklyRevenueSummary = {
  currentWeek: number;
  previousWeek: number;
  changePercent: number;
};

/** Paid bank deposit revenue grouped by advert package for a date range (inclusive). */
export type RevenueByAdvertPackageItem = {
  advertPackageId: string;
  packageName: string;
  revenue: number;
};
