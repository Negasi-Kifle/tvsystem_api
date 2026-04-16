import { Router } from 'express';
import { createPaymentHandlers } from '../controllers/payment.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { generatePaymentRequestDto } from '../dtos/requests/payment/generate-payment-req.dto';
import { fetchAllPaymentsDto } from '../dtos/requests/payment/fetch-all-payments.dto';
import { recordPaymentDto } from '../dtos/requests/payment/record-payment.dto';

export function createPaymentsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { generate, list, getById, sendPaymentRequest, recordPayment, remove } =
    createPaymentHandlers(deps);

  router.post('/generate', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), validateBody(generatePaymentRequestDto), generate);
  router.get('/', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), validateQuery(fetchAllPaymentsDto), list);

  router.post('/:id/send', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), sendPaymentRequest);
  router.patch(
    '/:id/record-payment',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SALES),
    validateBody(recordPaymentDto),
    recordPayment,
  );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), remove);

  return router;
}
