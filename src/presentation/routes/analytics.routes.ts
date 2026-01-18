import { Router } from 'express';
import { analyticsSummary } from '../controllers/analytics.controller';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router();

router.get(
  '/summary',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  analyticsSummary
);

export default router;
