import { Request, Response } from 'express';
import { AnalyticsService } from '../../application/services/analytics.service';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const analyticsService = new AnalyticsService();

export async function analyticsSummary(req: Request, res: Response) {
  const salesByShow = await analyticsService.salesByShow();
  res.json({
    permissionsAvailable: Object.values(PERMISSIONS),
    salesByShow
  });
}
