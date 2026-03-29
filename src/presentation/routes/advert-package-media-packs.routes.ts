import { Router } from 'express';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createAdvertPackageMediaPackDto } from '../dtos/requests/advert-package-media-pack/create.dto';
import { fetchAllAdvertPackageMediaPacksDto } from '../dtos/requests/advert-package-media-pack/fetch-all.dto';
import { updateAdvertPackageMediaPackDto } from '../dtos/requests/advert-package-media-pack/update.dto';
import { createAdvertPackageMediaPackHandlers } from '../controllers/advert-package-media-pack.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertPackageMediaPacksRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createAdvertPackageMediaPack,
    deleteAdvertPackageMediaPack,
    fetchAllAdvertPackageMediaPacks,
    findAdvertPackageMediaPackById,
    updateAdvertPackageMediaPack,
  } = createAdvertPackageMediaPackHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      validateBody(createAdvertPackageMediaPackDto),
      createAdvertPackageMediaPack,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_ADVERT_PACKAGES),
      validateQuery(fetchAllAdvertPackageMediaPacksDto),
      fetchAllAdvertPackageMediaPacks,
    );

  router
    .route('/:id')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_ADVERT_PACKAGES),
      findAdvertPackageMediaPackById,
    )
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      validateBody(updateAdvertPackageMediaPackDto),
      updateAdvertPackageMediaPack,
    )
    .delete(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      deleteAdvertPackageMediaPack,
    );

  return router;
}
