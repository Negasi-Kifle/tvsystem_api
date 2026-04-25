import { NextFunction, Request, Response } from 'express';
import type { AnalyticsService } from '../../application/services/analytics.service.js';
import type { ApiRouterDeps } from '../api-router-deps.js';

export function createAnalyticsHandlers(deps: Pick<ApiRouterDeps, 'analyticsService'>) {
  const { analyticsService } = deps;

  async function getKpis(_req: Request, res: Response, next: NextFunction) {
    try {
      const kpis = await analyticsService.getKpiSummary();
      res.status(200).json({ status: 'SUCCESS', data: { kpis } });
    } catch (error) {
      next(error);
    }
  }

  async function getMonthlyRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as { year: number };
      const monthlyRevenue = await analyticsService.getMonthlyRevenueSummary(query.year);
      res.status(200).json({ status: 'SUCCESS', data: { monthlyRevenue } });
    } catch (error) {
      next(error);
    }
  }

  async function getTopShows(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as { limit: number };
      const topShows = await analyticsService.getTopShowsByRevenue(query.limit);
      res.status(200).json({ status: 'SUCCESS', data: { topShows } });
    } catch (error) {
      next(error);
    }
  }

  return { getKpis, getMonthlyRevenue, getTopShows };
}
