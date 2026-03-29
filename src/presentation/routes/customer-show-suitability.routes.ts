import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { linkCustomerToShowSlotDto } from '../dtos/requests/customer-show-suitability/link-customer-to-show-slot.dto';
import { createCustomerShowSuitabilityHandlers } from '../controllers/customer-show-suitability.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCustomerShowSuitabilityRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { linkCustomerToShowSlot } = createCustomerShowSuitabilityHandlers(deps);

  router.post(
    '/',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SALES),
    validateBody(linkCustomerToShowSlotDto),
    linkCustomerToShowSlot,
  );

  return router;
}
