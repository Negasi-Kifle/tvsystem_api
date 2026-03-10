import { Router } from 'express';
import {
  createScheduleBlock,
  createBatchScheduleBlocks,
  listScheduleBlocks,
  listScheduleFreeBlocks,
  getScheduleBlockById,
  updateScheduleBlock,
  deleteScheduleBlock,
} from '../controllers/schedule-block.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createScheduleBlockDto } from '../dtos/requests/satellite-schedule-block/create-satellite-schedule-block.dto';
import { createBatchScheduleBlocksDto } from '../dtos/requests/satellite-schedule-block/create-batch-schedule-blocks.dto';
import { fetchScheduleBlocksDto } from '../dtos/requests/satellite-schedule-block/fetch-schedule-blocks.dto';
import { updateScheduleBlockDto } from '../dtos/requests/satellite-schedule-block/update-schedule-block.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SCHEDULES),
    validateQuery(fetchScheduleBlocksDto),
    listScheduleBlocks,
  )
  .post(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(createScheduleBlockDto),
    createScheduleBlock,
  );

router
  .route('/batch')
  .post(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(createBatchScheduleBlocksDto),
    createBatchScheduleBlocks,
  );

router.get(
  '/free',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SCHEDULES),
  listScheduleFreeBlocks,
);

router
  .route('/:blockId')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SCHEDULES),
    getScheduleBlockById,
  )
  .patch(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(updateScheduleBlockDto),
    updateScheduleBlock,
  )
  .delete(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    deleteScheduleBlock,
  );

export default router;
