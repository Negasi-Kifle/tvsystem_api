import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createCategoryDto } from '../dtos/requests/category/create-category.dto';
import { fetchAllCategories, createCategory } from '../controllers/category.controller';

const router = Router();

router
  .route('/')
  .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), fetchAllCategories)
  .post(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SALES),
    validateBody(createCategoryDto),
    createCategory,
  );

export default router;
