import { Router } from 'express';
import {
  createUser,
  me,
  requestPasswordReset,
  setUserActive
} from '../controllers/user.controller';
import { validateBody } from '../validators/validate-body';
import { createUserDto } from '../dtos/requests/create-user.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router();

router.get('/me', authMiddleware, me);
router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_USERS),
  validateBody(createUserDto),
  createUser
);
router.post('/reset-password', requestPasswordReset);
router.patch(
  '/:userId/active',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_USERS),
  setUserActive
);

export default router;
