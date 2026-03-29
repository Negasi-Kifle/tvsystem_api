import { Router } from 'express';
import { createTelegramGroupHandlers } from '../controllers/telegram-group.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { createTelegramGroupDto } from '../dtos/requests/telegram-group/create-tg.dto';
import { fetchAllTgGroupsDto } from '../dtos/requests/telegram-group/fetch-all-tg-groups.dto';
import { validateQuery } from '../validators/validate-query';
import { updateTelegramGroupDto } from '../dtos/requests/telegram-group/update-tg-group.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createTelegramGroupsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createTelegramGroup,
    deleteTelegramGroup,
    fetchAllTelegramGroups,
    getTelegramGroupById,
    updateTelegramGroup,
  } = createTelegramGroupHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS),
      validateBody(createTelegramGroupDto),
      createTelegramGroup,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS),
      validateQuery(fetchAllTgGroupsDto),
      fetchAllTelegramGroups,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS), getTelegramGroupById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS),
      validateBody(updateTelegramGroupDto),
      updateTelegramGroup,
    )
    .delete(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS),
      deleteTelegramGroup,
    );

  return router;
}
