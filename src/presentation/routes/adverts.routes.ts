import { Router } from 'express';
import { createAdvertHandlers } from '../controllers/advert.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createAdvertDto } from '../dtos/requests/advert/create-advert.dto';
import { updateAdvertDto } from '../dtos/requests/advert/update-advert.dto';
import { fetchAllAdvertsDto } from '../dtos/requests/advert/fetch-all-adverts.dto';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { create, update, getById, list, remove } = createAdvertHandlers(deps);

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_ADVERTS),
      validateQuery(fetchAllAdvertsDto),
      list,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERTS),
      validateBody(createAdvertDto),
      create,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), getById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERTS),
      validateBody(updateAdvertDto),
      update,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), remove);

  return router;
}
