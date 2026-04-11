import { Router } from 'express';
import { createAgentCommissionHandlers } from '../controllers/agent-commission.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAgentCommissionsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { calculate, list, getById, disburse } = createAgentCommissionHandlers(deps);

  router.post('/calculate', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), calculate);
  router.get('/', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), list);
  router.get('/:id', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getById);
  router.post('/:id/disburse', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), disburse);

  return router;
}
