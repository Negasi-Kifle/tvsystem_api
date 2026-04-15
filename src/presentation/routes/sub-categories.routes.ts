import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createSubCategoryDto } from '../dtos/requests/sub-category/create-sub-category.dto';
import { updateSubCategoryDto } from '../dtos/requests/sub-category/update-sub-category.dto';
import { createSubCategoryHandlers } from '../controllers/sub-category.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createSubCategoriesRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    fetchSubCategoriesByCategory,
    createSubCategory,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
  } = createSubCategoryHandlers(deps);

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

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getSubCategoryById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(updateSubCategoryDto),
      updateSubCategory,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), deleteSubCategory);

  return router;
}
