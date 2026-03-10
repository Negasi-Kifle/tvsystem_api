import { Router } from 'express';
import {
  generateBroadcastSlots,
  listBroadcastSlots,
  getBroadcastSlotById,
  updateBroadcastSlot,
  deleteBroadcastSlot,
} from '../controllers/broadcast-slot.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { generateBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/generate-broadcast-slots.dto';
import { fetchBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/fetch-broadcast-slots.dto';
import { updateBroadcastSlotDto } from '../dtos/requests/broadcast-slot/update-broadcast-slot.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SCHEDULES),
    validateQuery(fetchBroadcastSlotsDto),
    listBroadcastSlots,
  )
  .post(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(generateBroadcastSlotsDto),
    generateBroadcastSlots,
  );

router
  .route('/:slotId')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SCHEDULES),
    getBroadcastSlotById,
  )
  .patch(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(updateBroadcastSlotDto),
    updateBroadcastSlot,
  )
  .delete(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    deleteBroadcastSlot,
  );

export default router;
