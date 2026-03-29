import { Router } from 'express';
import { createPermissionHandlers } from '../controllers/permission.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { createPermissionDto } from '../dtos/requests/permission/create-permission.dto';
import { fetchAllPermissionsDto } from '../dtos/requests/permission/fetch-all-permissions.dto';
import { validateQuery } from '../validators/validate-query';
import { updatePermissionDto } from '../dtos/requests/permission/update-permission.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPermissionsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createPermission,
    deletePermission,
    fetchAllPermissions,
    getPermissionById,
    updatePermission,
  } = createPermissionHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PERMISSIONS),
      validateBody(createPermissionDto),
      createPermission,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PERMISSIONS),
      validateQuery(fetchAllPermissionsDto),
      fetchAllPermissions,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), getPermissionById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_PERMISSIONS),
      validateBody(updatePermissionDto),
      updatePermission,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), deletePermission);

  return router;
}
