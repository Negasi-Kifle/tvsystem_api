import { Router } from "express";
import { addUserToTelegramGroup, findManyTelegramGroupMembers, getTgMemberById, removeTgMemberFromGroup } from "../controllers/telegram-group-member.controller";
import { validateBody } from "../validators/validate-body";
import { addUserToTelegramGroupDto } from "../dtos/requests/tg-group-member/add-user-to-tg-group.dto";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { fetchAllTgMembersDto } from "../dtos/requests/tg-group-member/fetch-all-tg-members.dto";
import { validateQuery } from "../validators/validate-query";
import { removeUserFromTelegramGroupDto } from "../dtos/requests/tg-group-member/remove-user-from-tg-group.dto";

const router = Router();

router.route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS), validateBody(addUserToTelegramGroupDto), addUserToTelegramGroup)
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS), validateQuery(fetchAllTgMembersDto), findManyTelegramGroupMembers);


router.route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS), getTgMemberById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUP_MEMBERS), removeTgMemberFromGroup);



export default router;