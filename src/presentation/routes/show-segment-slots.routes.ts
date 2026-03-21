import { Router } from 'express';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { fetchShowSegmentSlotsByShow } from '../controllers/show-segment-slot.controller';

const router = Router();

router.get(
  '/show/:showId',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SALES),
  fetchShowSegmentSlotsByShow,
);

export default router;
