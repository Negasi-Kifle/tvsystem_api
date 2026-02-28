import { AddMemberToTelegramGroupUseCase } from "../../application/use-cases/telegram-group-members/add-member-to-tg-group.use-case";
import { AddUserToTelegramGroupDto } from "../dtos/tg-group-member/add-user-to-tg-group.dto";
import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../../shared/utils/error-handler";
import { FetchAllTgMembersDto } from "../dtos/tg-group-member/fetch-all-tg-members.dto";
import { TelegramGroupMemberRepository } from "../../infrastructure/prisma/repositories/telegram-group-member.repository";
import { UserRepository } from "../../infrastructure/prisma/repositories/user.repository";
import { FindTelegramGroupMemberByIdUseCase } from "../../application/use-cases/telegram-group-members/find-by-id.use-case";
import { RemoveMemberFromTelegramGroupUseCase } from "../../application/use-cases/telegram-group-members/remove-member-from-teg";
import { TelegramGroupRepository } from "../../infrastructure/prisma/repositories/telegram-group.repository";
import { mapFetchAllTgMembersDtoToQueryOptions } from "../mappers/teg-member-to-query-options.mapper";
import { CountTelegramGroupMembersUseCase } from "../../application/use-cases/telegram-group-members/count-tg-members.use-case";
import { FetchAllTelegramGroupMembersUseCase } from "../../application/use-cases/telegram-group-members/fetch-all.use-case";

const telegramGroupRepository = new TelegramGroupRepository();
const userRepository = new UserRepository();
const telegramGroupMemberRepository = new TelegramGroupMemberRepository();
const addMemberToTelegramGroupUseCase = new AddMemberToTelegramGroupUseCase(telegramGroupMemberRepository, telegramGroupRepository, userRepository);
const findTelegramGroupMemberByIdUseCase = new FindTelegramGroupMemberByIdUseCase(telegramGroupMemberRepository);
const removeMemberFromTelegramGroupUseCase = new RemoveMemberFromTelegramGroupUseCase(telegramGroupMemberRepository);
const fetchAllTelegramGroupMembersUseCase = new FetchAllTelegramGroupMembersUseCase(telegramGroupMemberRepository);
const countTelegramGroupMembersUseCase = new CountTelegramGroupMembersUseCase(telegramGroupMemberRepository);


export async function addUserToTelegramGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body as AddUserToTelegramGroupDto;
        const telegramGroupMember = await addMemberToTelegramGroupUseCase.execute(payload.userId, payload.telegramGroupId);

        res.status(201).json({
            status: 'SUCCESS',
            message: 'User added to telegram group successfully',
            data: { telegramGroupMember }
        });
    } catch (error) {
        next(error)
    }
}


export async function findManyTelegramGroupMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const query = res.locals.query as FetchAllTgMembersDto;
        const queryOptions = mapFetchAllTgMembersDtoToQueryOptions(query);

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const [telegramGroupMembers, total] = await Promise.all([
            fetchAllTelegramGroupMembersUseCase.execute(queryOptions),
            countTelegramGroupMembersUseCase.execute(queryOptions)
        ]);

        res.status(200).json({
            status: 'SUCCESS',
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            data: { telegramGroupMembers }
        });
    } catch (error) {
        next(error)
    }
}


export async function getTgMemberById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const telegramGroupMember = await findTelegramGroupMemberByIdUseCase.execute(id);
        if (!telegramGroupMember) {
            const error = new Error('Telegram group member not found');
            return sendErrorResponse(res, 404, 'Telegram group member not found', error);
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: { telegramGroupMember }
        });
    } catch (error) {
        next(error)
    }
}


export async function removeTgMemberFromGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const tgMember = await removeMemberFromTelegramGroupUseCase.execute(id);

        // TODO: A background task to remove user from the telegram group using Telegram's API


        res.status(200).json({
            status: 'SUCCESS',
            message: "Member removed from group successfully",
        });
    } catch (error) {
        next(error)
    }
}