import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  me,
  resetPassword,
  setUserActive
} from '../controllers/user.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createUserDto } from '../dtos/requests/create-user.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { resetPasswordDto } from '../dtos/requests/reset-paswd.dto';
import { fetchAllUsersDto } from '../dtos/requests/fetch-all-users.dto';

const router = Router();

router.get('/me', authMiddleware, me);
router.route('/')
  .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateQuery(fetchAllUsersDto), getAllUsers)
  .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateBody(createUserDto), createUser);

router.patch('/reset-password', authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateBody(resetPasswordDto), resetPassword);

router.patch(
  '/:userId/active',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_USERS),
  setUserActive
);

router.route('/:id')
  .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), getUserById)
  .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), deleteUser);

export default router;
