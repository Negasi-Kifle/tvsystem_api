import { Router } from 'express';
import {
  createUser,
  updateUser,
  updateUserStatus,
  getAllUsers,
  getUserById,
  deleteUser,
  resetPassword,
  me,
} from '../controllers/user.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createUserDto } from '../dtos/requests/user/create-user.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { resetPasswordDto } from '../dtos/requests/user/reset-paswd.dto';
import { fetchAllUsersDto } from '../dtos/requests/user/fetch-all-users.dto';
import { updateUserDto } from '../dtos/requests/user/update-user.dto';
import { updateUserStatusDto } from '../dtos/requests/user/update-status.dto';

const router = Router();

router.get('/me', authMiddleware, me);

router.route('/')
  .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateQuery(fetchAllUsersDto), getAllUsers)
  .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateBody(createUserDto), createUser);

router.patch('/reset-password', authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateBody(resetPasswordDto), resetPassword);
router.patch('/:id/status', authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), validateBody(updateUserStatusDto), updateUserStatus);


router.route('/:id')
  .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), getUserById)
  .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USERS), deleteUser)
  .patch(authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_USERS),
    validateBody(updateUserDto),
    updateUser
  );

export default router;
