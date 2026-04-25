import { Router } from 'express';
import z from 'zod';
import { createAnalyticsHandlers } from '../controllers/analytics.controller.js';
import { requirePermission } from '../../composition/http-middlewares.js';
import { PERMISSIONS } from '../../shared/constants/permissions.constants.js';
import { validateQuery } from '../validators/validate-query.js';
import type { ApiRouterDeps } from '../api-router-deps.js';

const monthlyRevenueQueryDto = z
  .object({
    year: z.coerce.number().int().min(2020).max(2100).default(new Date().getFullYear()),
  })
  .strict();

const topShowsQueryDto = z
  .object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

export function createAnalyticsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { getKpis, getMonthlyRevenue, getTopShows } = createAnalyticsHandlers(deps);

  router.get(
    '/kpis',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_ANALYTICS),
    getKpis,
  );

  router.get(
    '/monthly-revenue',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_ANALYTICS),
    validateQuery(monthlyRevenueQueryDto),
    getMonthlyRevenue,
  );

  router.get(
    '/top-shows',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_ANALYTICS),
    validateQuery(topShowsQueryDto),
    getTopShows,
  );

  return router;
}
