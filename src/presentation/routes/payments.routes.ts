import { Router } from 'express';
import { createPaymentHandlers } from '../controllers/payment.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPaymentsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { generate, list, getById, sendPaymentRequest, recordPayment, remove } =
    createPaymentHandlers(deps);

  router.post('/generate', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), generate);
  router.get('/', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), list);

  router.post('/:id/send', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), sendPaymentRequest);
  router.patch('/:id/record-payment', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), recordPayment);

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), remove);

  return router;
}
