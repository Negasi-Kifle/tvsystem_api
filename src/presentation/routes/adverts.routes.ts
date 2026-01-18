import { Router } from 'express';
import { createAdvert } from '../controllers/advert.controller';
import { validateBody } from '../validators/validate-body';
import { createAdvertDto } from '../dtos/requests/create-advert.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router();

router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_ADVERTS),
  validateBody(createAdvertDto),
  createAdvert
);

export default router;
