import { prisma } from '../../infrastructure/database/prisma';

export class AnalyticsService {
  async salesByShow() {
    const result = await prisma.advert.groupBy({
      by: ['showId'],
      _count: { id: true }
    });

    // Transform to match the previous MongoDB aggregate format
    return result.map((item) => ({
      _id: item.showId,
      total: item._count.id
    }));
  }

  async salesByStatus() {
    const result = await prisma.advert.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    return result.map((item) => ({
      _id: item.status,
      total: item._count.id
    }));
  }

  async totalAdverts() {
    return prisma.advert.count();
  }

  async totalCustomers() {
    return prisma.customer.count();
  }

  async totalShows() {
    return prisma.show.count();
  }

  async pendingPayments() {
    return prisma.payment.count({
      where: {
        status: 'Pending'
      }
    });
  }
}
