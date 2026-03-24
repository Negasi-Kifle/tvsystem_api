import { Router } from 'express';
import { validateQuery } from '../validators/validate-query';
import {
  validateAdvertPackageMultipartCreate,
  validateAdvertPackageMultipartUpdate,
} from '../validators/validate-advert-package-multipart';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { advertPackageImageUploadMiddleware } from '../../infrastructure/middlewares/advert-package-upload.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { fetchAllAdvertPackagesDto } from '../dtos/requests/advert-package/fetch-all.dto';
import {
  createAdvertPackageHandlers,
  type AdvertPackageHandlerDeps,
} from '../controllers/advert-package.controller';

export function createAdvertPackageRouter(deps: AdvertPackageHandlerDeps): Router {
  const router = Router();
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
      advertPackageImageUploadMiddleware,
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
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_ADVERT_PACKAGES),
      getAdvertPackageById,
    )
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      advertPackageImageUploadMiddleware,
      validateAdvertPackageMultipartUpdate,
      updateAdvertPackage,
    )
    .delete(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
      deleteAdvertPackage,
    );

  return router;
}
