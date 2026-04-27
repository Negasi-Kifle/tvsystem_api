import { PaymentEntity } from '../entities/payment.entity';
import { IBaseRepository } from './base.repository.interface';
import type {
  MonthlyRevenueItem,
  RevenueByAdvertPackageItem,
  WeeklyRevenueSummary,
} from '../interfaces/analytics.interface';

export interface IPaymentRepository extends IBaseRepository<PaymentEntity> {
  /** Sum of bankDeposit for Paid payments whose paymentDate falls within [from, to]. */
  sumPaidRevenue(from: Date, to: Date): Promise<number>;
  /** 12-item array for the given year: revenue = Paid bankDeposit, target = linked AdvertSales finalPrice. */
  getMonthlyRevenueSummary(year: number): Promise<MonthlyRevenueItem[]>;
  /** Current calendar week (Mon–Sun) paid revenue vs previous week, with changePercent. */
  getWeeklyRevenueSummary(): Promise<WeeklyRevenueSummary>;
  /**
   * Sum of bank_deposit for Paid payments in [from, to], grouped by advert package.
   * Uses payment_date; rows ordered by revenue descending.
   */
  sumPaidRevenueByAdvertPackage(from: Date, to: Date): Promise<RevenueByAdvertPackageItem[]>;
}
