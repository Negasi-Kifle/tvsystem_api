import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createAdvertPackageDto } from '../dtos/requests/advert-package/create.dto';
import { updateAdvertPackageDto } from '../dtos/requests/advert-package/update.dto';
import { fetchAllAdvertPackagesDto } from '../dtos/requests/advert-package/fetch-all.dto';
import {
  createAdvertPackage,
  deleteAdvertPackage,
  fetchAllAdvertPackages,
  getAdvertPackageById,
  updateAdvertPackage,
} from '../controllers/advert-package.controller';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
    validateBody(createAdvertPackageDto),
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
    validateBody(updateAdvertPackageDto),
    updateAdvertPackage,
  )
  .delete(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_ADVERT_PACKAGES),
    deleteAdvertPackage,
  );

export default router;
