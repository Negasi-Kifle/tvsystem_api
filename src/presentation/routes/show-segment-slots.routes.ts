import { Router } from 'express';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createShowSegmentSlotDto } from '../dtos/requests/show-segment-slot/create-show-segment-slot.dto';
import { fetchAllShowSegmentSlotsDto } from '../dtos/requests/show-segment-slot/fetch-all-show-segment-slots.dto';
import { updateShowSegmentSlotDto } from '../dtos/requests/show-segment-slot/update-show-segment-slot.dto';
import { createShowSegmentSlotHandlers } from '../controllers/show-segment-slot.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createShowSegmentSlotsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    listShowSegmentSlots,
    createShowSegmentSlot,
    getShowSegmentSlotById,
    updateShowSegmentSlot,
    deleteShowSegmentSlot,
  } = createShowSegmentSlotHandlers(deps);

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_SALES),
      validateQuery(fetchAllShowSegmentSlotsDto),
      listShowSegmentSlots,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(createShowSegmentSlotDto),
      createShowSegmentSlot,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getShowSegmentSlotById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(updateShowSegmentSlotDto),
      updateShowSegmentSlot,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), deleteShowSegmentSlot);

  return router;
}
