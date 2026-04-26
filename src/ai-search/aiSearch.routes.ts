/**
 * AI prospect discovery (stateless, no DB).
 *
 * Example:
 *   POST /api/ai-search
 *   Authorization: Bearer <access_token>
 *   Body: { "query": "manufacturing companies in Ethiopia not advertising on TV" }
 *   200: [ { "name", "website", "industry", "location", "contacts", "source", "confidenceScore", "reason" } ]
 */

import { Router } from 'express';
import { createAiSearchHandlers } from './aiSearch.controller.js';
import { requirePermission } from '../composition/http-middlewares.js';
import { PERMISSIONS } from '../shared/constants/permissions.constants.js';
import { validateBody } from '../presentation/validators/validate-body.js';
import { aiSearchBodySchema } from './aiSearch.types.js';
import type { ApiRouterDeps } from '../presentation/api-router-deps.js';

export function createAiSearchRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { postAiSearch } = createAiSearchHandlers(deps);

  router.post('/', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), validateBody(aiSearchBodySchema), postAiSearch);

  return router;
}
