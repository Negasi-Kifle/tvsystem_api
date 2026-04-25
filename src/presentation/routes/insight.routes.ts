import { Router } from 'express';
import { z } from 'zod';
import { createInsightHandlers } from '../controllers/insight.controller.js';
import { requirePermission } from '../../composition/http-middlewares.js';
import { PERMISSIONS } from '../../shared/constants/permissions.constants.js';
import { validateBody } from '../validators/validate-body.js';
import type { ApiRouterDeps } from '../api-router-deps.js';

const insightQueryDto = z
  .object({
    question: z.string().min(3).max(1000).trim(),
  })
  .strict();

export function createInsightRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { queryInsight } = createInsightHandlers(deps);

  router.post(
    '/query',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_ANALYTICS),
    validateBody(insightQueryDto),
    queryInsight,
  );

  return router;
}
