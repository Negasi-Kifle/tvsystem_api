import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createCategoryDto } from '../dtos/requests/category/create-category.dto';
import { createCategoryHandlers } from '../controllers/category.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCategoriesRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { fetchAllCategories, createCategory } = createCategoryHandlers(deps);

  router
    .route('/')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), fetchAllCategories)
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(createCategoryDto),
      createCategory,
    );

  return router;
}
