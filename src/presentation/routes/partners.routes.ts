import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateQuery } from '../validators/validate-query';
import { createPartnerDto } from '../dtos/requests/partner/create';
import { createPartnerHandlers } from '../controllers/partner.controller';
import { fetchAllPartnersDto } from '../dtos/requests/partner/fetch-all';
import { updatePartnerDto } from '../dtos/requests/partner/update';
import { updatePartnerStatusDto } from '../dtos/requests/partner/update-status';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPartnerRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createPartner,
    deletePartner,
    fetchAllPartners,
    getPartner,
    updatePartner,
    updatePartnerStatus,
  } = createPartnerHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PARTNERS),
      validateBody(createPartnerDto),
      createPartner,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PARTNERS),
      validateQuery(fetchAllPartnersDto),
      fetchAllPartners,
    );

  router
    .route('/:id/status')
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PARTNERS),
      validateBody(updatePartnerStatusDto),
      updatePartnerStatus,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), getPartner)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PARTNERS),
      validateBody(updatePartnerDto),
      updatePartner,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), deletePartner);

  return router;
}
