import { Router } from 'express';
import { createPaymentRequest } from '../controllers/finance.controller';
import { validateBody } from '../validators/validate-body';
import { createPaymentDto } from '../dtos/requests/create-payment.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router();

router.post(
  '/payments',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_FINANCE),
  validateBody(createPaymentDto),
  createPaymentRequest
);

export default router;
