import { Router } from 'express';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createShowSegmentSlotHandlers } from '../controllers/show-segment-slot.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createShowSegmentSlotsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { fetchShowSegmentSlotsByShow } = createShowSegmentSlotHandlers(deps);

  router.get(
    '/show/:showId',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SALES),
    fetchShowSegmentSlotsByShow,
  );

  return router;
}
