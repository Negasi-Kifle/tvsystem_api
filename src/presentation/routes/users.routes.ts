import { Router } from 'express';
import { createUserHandlers } from '../controllers/user.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createUserDto } from '../dtos/requests/user/create-user.dto';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { resetPasswordDto } from '../dtos/requests/user/reset-paswd.dto';
import { fetchAllUsersDto } from '../dtos/requests/user/fetch-all-users.dto';
import { updateUserDto } from '../dtos/requests/user/update-user.dto';
import { updateUserStatusDto } from '../dtos/requests/user/update-status.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createUsersRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createUser,
    updateUser,
    updateUserStatus,
    getAllUsers,
    getUserById,
    deleteUser,
    resetPassword,
    me,
  } = createUserHandlers(deps);

  router.get('/me', authMiddleware, me);

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USERS),
      validateQuery(fetchAllUsersDto),
      getAllUsers,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USERS),
      validateBody(createUserDto),
      createUser,
    );

  router.patch(
    '/reset-password',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_USERS),
    validateBody(resetPasswordDto),
    resetPassword,
  );
  router.patch(
    '/:id/status',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_USERS),
    validateBody(updateUserStatusDto),
    updateUserStatus,
  );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), getUserById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), deleteUser)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_USERS),
      validateBody(updateUserDto),
      updateUser,
    );

  return router;
}
