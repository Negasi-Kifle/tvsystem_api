import { Router } from 'express';
import { proposeCompensation } from '../controllers/compensation.controller';
import { validateBody } from '../validators/validate-body';
import { compensationDto } from '../dtos/requests/compensation.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router();

router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_ADVERTS),
  validateBody(compensationDto),
  proposeCompensation
);

export default router;
