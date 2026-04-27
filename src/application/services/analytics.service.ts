import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface.js';
import type { IShowRepository } from '../../domain/repositories/show.repository.interface.js';
import type { IAdvertPlacementRepository } from '../../domain/repositories/advert-placement.repository.interface.js';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface.js';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import type {
  AnalyticsKpiSummary,
  MonthlyRevenueItem,
  RevenueByAdvertPackageItem,
  TopShowEntry,
} from '../../domain/interfaces/analytics.interface.js';
import { CustomerStatusWithUs } from '../../domain/enums/customer-status.enum.js';

const LEAD_STATUSES: CustomerStatusWithUs[] = [
  CustomerStatusWithUs.COLD_PROGRESS,
  CustomerStatusWithUs.HOT_PROGRESS,
  CustomerStatusWithUs.LEAD,
];

const CONVERTED_STATUSES: CustomerStatusWithUs[] = [
  CustomerStatusWithUs.CUSTOMER,
  CustomerStatusWithUs.PARTNER,
];

function computeChangePercent(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function currentMonthRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { from, to };
}

function previousMonthRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { from, to };
}

/** YYYY-MM; inclusive calendar month bounds in the server local timezone. */
export function dateRangeForYearMonth(ym: string): { from: Date; to: Date } {
  const m = ym.match(/^(\d{4})-(\d{2})$/);
  if (!m) {
    throw new Error(`Invalid month: ${ym} (expected YYYY-MM)`);
  }
  const y = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${ym}`);
  }
  const from = new Date(y, month - 1, 1);
  const to = new Date(y, month, 0, 23, 59, 59, 999);
  return { from, to };
}

export function currentYearMonthLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export class AnalyticsService {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly showRepo: IShowRepository,
    private readonly advertPlacementRepo: IAdvertPlacementRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async getKpiSummary(): Promise<AnalyticsKpiSummary> {
    const curr = currentMonthRange();
    const prev = previousMonthRange();

    const [
      currRevenue,
      prevRevenue,
      activeShows,
      currShows,
      prevShows,
      activeAds,
      currAds,
      prevAds,
      totalCustomers,
      currCustomers,
      prevCustomers,
      convertedCount,
      activeLeads,
      currLeads,
      prevLeads,
    ] = await Promise.all([
      this.paymentRepo.sumPaidRevenue(curr.from, curr.to),
      this.paymentRepo.sumPaidRevenue(prev.from, prev.to),
      this.showRepo.countActive(),
      this.showRepo.countCreatedInRange(curr.from, curr.to),
      this.showRepo.countCreatedInRange(prev.from, prev.to),
      this.advertPlacementRepo.countScheduledNow(),
      this.advertPlacementRepo.countCreatedInRange(curr.from, curr.to),
      this.advertPlacementRepo.countCreatedInRange(prev.from, prev.to),
      this.customerRepo.count(),
      this.customerRepo.countByStatusesCreatedInRange(
        [...LEAD_STATUSES, ...CONVERTED_STATUSES],
        curr.from,
        curr.to,
      ),
      this.customerRepo.countByStatusesCreatedInRange(
        [...LEAD_STATUSES, ...CONVERTED_STATUSES],
        prev.from,
        prev.to,
      ),
      this.customerRepo.countByStatuses(CONVERTED_STATUSES),
      this.customerRepo.countByStatuses(LEAD_STATUSES),
      this.customerRepo.countByStatusesCreatedInRange(LEAD_STATUSES, curr.from, curr.to),
      this.customerRepo.countByStatusesCreatedInRange(LEAD_STATUSES, prev.from, prev.to),
    ]);

    const conversionRate =
      totalCustomers === 0 ? 0 : Math.round((convertedCount / totalCustomers) * 1000) / 10;

    const prevTotalCustomers = totalCustomers - currCustomers + prevCustomers;
    const prevConvertedCount = convertedCount - currCustomers + prevCustomers;
    const prevConversionRate =
      prevTotalCustomers === 0
        ? 0
        : Math.round((prevConvertedCount / prevTotalCustomers) * 1000) / 10;

    return {
      totalRevenue: {
        value: Math.round(currRevenue * 100) / 100,
        changePercent: computeChangePercent(currRevenue, prevRevenue),
      },
      activeShows: {
        value: activeShows,
        changePercent: computeChangePercent(currShows, prevShows),
      },
      activeAds: {
        value: activeAds,
        changePercent: computeChangePercent(currAds, prevAds),
      },
      totalCustomers: {
        value: totalCustomers,
        changePercent: computeChangePercent(currCustomers, prevCustomers),
      },
      conversionRate: {
        value: conversionRate,
        changePercent: computeChangePercent(conversionRate, prevConversionRate),
      },
      activeLeads: {
        value: activeLeads,
        changePercent: computeChangePercent(currLeads, prevLeads),
      },
    };
  }

  async getMonthlyRevenueSummary(year: number): Promise<MonthlyRevenueItem[]> {
    return this.paymentRepo.getMonthlyRevenueSummary(year);
  }

  async getTopShowsByRevenue(limit: number): Promise<TopShowEntry[]> {
    return this.advertSalesRepo.getTopShowsByRevenue(limit);
  }

  /**
   * Paid revenue (bank deposits) by advert package for a calendar month.
   * `month` is YYYY-MM (server local calendar); omit for the current month.
   */
  async getRevenueByAdvertPackageForMonth(month?: string): Promise<RevenueByAdvertPackageItem[]> {
    const { from, to } = month ? dateRangeForYearMonth(month) : currentMonthRange();
    return this.paymentRepo.sumPaidRevenueByAdvertPackage(from, to);
  }
}
