import { describe, expect, it, jest } from '@jest/globals';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import type { IShowRepository } from '../../domain/repositories/show.repository.interface';
import type { IAdvertPlacementRepository } from '../../domain/repositories/advert-placement.repository.interface';
import type { IAdvertSalesRepository } from '../../domain/repositories/adver-sales.repository.interface';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import {
  AnalyticsService,
  dateRangeForYearMonth,
} from '../../application/services/analytics.service';
import type { RevenueByAdvertPackageItem } from '../../domain/interfaces/analytics.interface';

function makeService(paymentRepo: Pick<IPaymentRepository, 'sumPaidRevenueByAdvertPackage'>) {
  return new AnalyticsService(
    paymentRepo as IPaymentRepository,
    {} as IShowRepository,
    {} as IAdvertPlacementRepository,
    {} as IAdvertSalesRepository,
    {} as ICustomerRepository,
  );
}

describe('dateRangeForYearMonth', () => {
  it('returns first and last instant of April 2026 in local timezone', () => {
    const { from, to } = dateRangeForYearMonth('2026-04');
    expect(from.getFullYear()).toBe(2026);
    expect(from.getMonth()).toBe(3);
    expect(from.getDate()).toBe(1);
    expect(to.getFullYear()).toBe(2026);
    expect(to.getMonth()).toBe(3);
    expect(to.getDate()).toBe(30);
    expect(to.getHours()).toBe(23);
  });

  it('throws on invalid format', () => {
    expect(() => dateRangeForYearMonth('2026-13')).toThrow();
    expect(() => dateRangeForYearMonth('bad')).toThrow();
  });
});

describe('AnalyticsService.getRevenueByAdvertPackageForMonth', () => {
  it('calls sumPaidRevenueByAdvertPackage with bounds for the given YYYY-MM', async () => {
    const sumPaidRevenueByAdvertPackage = jest
      .fn<(from: Date, to: Date) => Promise<RevenueByAdvertPackageItem[]>>()
      .mockResolvedValue([]);
    const svc = makeService({ sumPaidRevenueByAdvertPackage });
    await svc.getRevenueByAdvertPackageForMonth('2026-04');
    expect(sumPaidRevenueByAdvertPackage).toHaveBeenCalledTimes(1);
    const [from, to] = sumPaidRevenueByAdvertPackage.mock.calls[0] as [Date, Date];
    expect(from).toEqual(dateRangeForYearMonth('2026-04').from);
    expect(to).toEqual(dateRangeForYearMonth('2026-04').to);
  });
});
