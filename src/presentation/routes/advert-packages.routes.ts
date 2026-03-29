import { Router } from 'express';
import { validateQuery } from '../validators/validate-query';
import {
  validateAdvertPackageMultipartCreate,
  validateAdvertPackageMultipartUpdate,
} from '../validators/validate-advert-package-multipart';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { fetchAllAdvertPackagesDto } from '../dtos/requests/advert-package/fetch-all.dto';
import { createAdvertPackageHandlers } from '../controllers/advert-package.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertPackageRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { advertPackageImageUpload } = deps;
  const {
    createAdvertPackage,
    deleteAdvertPackage,
    fetchAllAdvertPackages,
    getAdvertPackageById,
    updateAdvertPackage,
  } = createAdvertPackageHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      advertPackageImageUpload,
      validateAdvertPackageMultipartCreate,
      createAdvertPackage,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_ADVERT_PACKAGES),
      validateQuery(fetchAllAdvertPackagesDto),
      fetchAllAdvertPackages,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERT_PACKAGES), getAdvertPackageById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      advertPackageImageUpload,
      validateAdvertPackageMultipartUpdate,
      updateAdvertPackage,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES), deleteAdvertPackage);

  return router;
}
