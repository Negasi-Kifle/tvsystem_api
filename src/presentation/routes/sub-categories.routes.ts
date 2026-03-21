import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createSubCategoryDto } from '../dtos/requests/sub-category/create-sub-category.dto';
import {
  fetchSubCategoriesByCategory,
  createSubCategory,
} from '../controllers/sub-category.controller';

const router = Router();

router.get(
  '/category/:categoryId',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SALES),
  fetchSubCategoriesByCategory,
);

router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SALES),
  validateBody(createSubCategoryDto),
  createSubCategory,
);

export default router;
