import { Router } from 'express';
import { createUserPermissionHandlers } from '../controllers/user-permission.controller';
import { validateBody } from '../validators/validate-body';
import { createUserPermissionDto } from '../dtos/requests/user-permission/create-user-permission.dto';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { requirePermission } from '../../composition/http-middlewares';
import { validateQuery } from '../validators/validate-query';
import { fetchAllUserPermissionsDto } from '../dtos/requests/user-permission/fetch-all-user-permissions.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createUserPermissionsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createUserPermission,
    fetchAllUserPermissions,
    findUserPermissionById,
    deleteUserPermission,
  } = createUserPermissionHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS),
      validateBody(createUserPermissionDto),
      createUserPermission,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS),
      validateQuery(fetchAllUserPermissionsDto),
      fetchAllUserPermissions,
    );

  router
    .route('/:id')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS),
      findUserPermissionById,
    )
    .delete(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS),
      deleteUserPermission,
    );

  return router;
}
