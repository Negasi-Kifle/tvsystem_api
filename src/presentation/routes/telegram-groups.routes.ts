import { Router } from "express";
import { createTelegramGroup, deleteTelegramGroup, fetchAllTelegramGroups, getTelegramGroupById, updateTelegramGroup } from "../controllers/telegram-group.controller";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { validateBody } from "../validators/validate-body";
import { createTelegramGroupDto } from "../dtos/requests/telegram-group/create-tg.dto";
import { fetchAllTgGroupsDto } from "../dtos/requests/telegram-group/fetch-all-tg-groups.dto";
import { validateQuery } from "../validators/validate-query";
import { updateTelegramGroupDto } from "../dtos/requests/telegram-group/update-tg-group.dto";

const router = Router();

router.route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS), validateBody(createTelegramGroupDto), createTelegramGroup)
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS), validateQuery(fetchAllTgGroupsDto), fetchAllTelegramGroups);


router.route("/:id")
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS), getTelegramGroupById)
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS), validateBody(updateTelegramGroupDto), updateTelegramGroup)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_TELEGRAM_GROUPS), deleteTelegramGroup);



export default router;