import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createCategoryDto } from '../dtos/requests/category/create-category.dto';
import { updateCategoryDto } from '../dtos/requests/category/update-category.dto';
import { fetchAllCategoriesDto } from '../dtos/requests/category/fetch-all-categories.dto';
import { createCategoryHandlers } from '../controllers/category.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCategoriesRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { fetchAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory } =
    createCategoryHandlers(deps);

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_SALES),
      validateQuery(fetchAllCategoriesDto),
      fetchAllCategories,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(createCategoryDto),
      createCategory,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getCategoryById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(updateCategoryDto),
      updateCategory,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), deleteCategory);

  return router;
}
