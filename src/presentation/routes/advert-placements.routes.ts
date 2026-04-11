import { Router } from 'express';
import { createAdvertPlacementHandlers } from '../controllers/advert-placement.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createAdvertPlacementDto } from '../dtos/requests/advert-placement/create.dto';
import { updateAdvertPlacementDto } from '../dtos/requests/advert-placement/update.dto';
import { fetchAllAdvertPlacementsDto } from '../dtos/requests/advert-placement/fetch-all.dto';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertPlacementsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { create, batchCreate, update, getById, list, remove, statusBoard } =
    createAdvertPlacementHandlers(deps);

  router.get(
    '/status-board',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_ADVERTS),
    statusBoard,
  );

  router.post(
    '/batch',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_ADVERTS),
    batchCreate,
  );

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_ADVERTS),
      validateQuery(fetchAllAdvertPlacementsDto),
      list,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERTS),
      validateBody(createAdvertPlacementDto),
      create,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), getById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERTS),
      validateBody(updateAdvertPlacementDto),
      update,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), remove);

  return router;
}
