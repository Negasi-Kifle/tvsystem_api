import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { linkCustomerToShowSlotDto } from '../dtos/requests/customer-show-suitability/link-customer-to-show-slot.dto';
import { linkCustomerToShowSlot } from '../controllers/customer-show-suitability.controller';

const router = Router();

router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SALES),
  validateBody(linkCustomerToShowSlotDto),
  linkCustomerToShowSlot,
);

export default router;
