import { Router } from 'express';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createAdvertPackageMediaPackDto } from '../dtos/requests/advert-package-media-pack/create.dto';
import { fetchAllAdvertPackageMediaPacksDto } from '../dtos/requests/advert-package-media-pack/fetch-all.dto';
import { updateAdvertPackageMediaPackDto } from '../dtos/requests/advert-package-media-pack/update.dto';
import {
  createAdvertPackageMediaPack,
  deleteAdvertPackageMediaPack,
  fetchAllAdvertPackageMediaPacks,
  findAdvertPackageMediaPackById,
  updateAdvertPackageMediaPack,
} from '../controllers/advert-package-media-pack.controller';

const router = Router();

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

export default router;
