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
