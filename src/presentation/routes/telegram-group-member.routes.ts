import { Router } from 'express';
import { createTelegramGroupMemberHandlers } from '../controllers/telegram-group-member.controller';
import { validateBody } from '../validators/validate-body';
import { addUserToTelegramGroupDto } from '../dtos/requests/tg-group-member/add-user-to-tg-group.dto';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { fetchAllTgMembersDto } from '../dtos/requests/tg-group-member/fetch-all-tg-members.dto';
import { validateQuery } from '../validators/validate-query';
import type { ApiRouterDeps } from '../api-router-deps';

export function createTelegramGroupMemberRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    addUserToTelegramGroup,
    findManyTelegramGroupMembers,
    getTgMemberById,
    removeTgMemberFromGroup,
  } = createTelegramGroupMemberHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS),
      validateBody(addUserToTelegramGroupDto),
      addUserToTelegramGroup,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS),
      validateQuery(fetchAllTgMembersDto),
      findManyTelegramGroupMembers,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS), getTgMemberById)
    .delete(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS),
      removeTgMemberFromGroup,
    );

  return router;
}
