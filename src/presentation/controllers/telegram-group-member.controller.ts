import { TelegramGroupMembersUseCases } from "../../application/use-cases/telegram-group-members";
import { AddUserToTelegramGroupDto } from "../dtos/requests/add-user-to-tg-group.dto";
import { Request, Response } from "express";
import { sendErrorResponse } from "../../shared/utils/error-handler";
import { FetchAllTgMembersDto } from "../dtos/requests/fetch-all-tg-members.dto";
import { RemoveUserFromTelegramGroupDto } from "../dtos/requests/remove-user-from-tg-group.dto";

const tgMembersUseCases = new TelegramGroupMembersUseCases();

export async function addUserToTelegramGroup(req: Request, res: Response) {
    try {
        const payload = req.body as AddUserToTelegramGroupDto;
        const telegramGroupMember = await tgMembersUseCases.addMemberToTelegramGroupUseCase.execute(payload.userId, payload.telegramGroupId);

        res.status(201).json({
            status: 'SUCCESS',
            message: 'User added to telegram group successfully',
            data: { telegramGroupMember }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}


export async function findManyTelegramGroupMembers(req: Request, res: Response) {
    try {
        const query = res.locals.query as FetchAllTgMembersDto;
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const [telegramGroupMembers, total] = await Promise.all([
            tgMembersUseCases.fetchAllTelegramGroupMembersUseCase.execute(query),
            tgMembersUseCases.countTelegramGroupMembersUseCase.execute(query)
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
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}


export async function getTgMemberById(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const telegramGroupMember = await tgMembersUseCases.findByIdTgMemberUseCase.execute(id);
        if (!telegramGroupMember) {
            const error = new Error('Telegram group member not found');
            return sendErrorResponse(res, 404, 'Telegram group member not found', error);
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: { telegramGroupMember }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}


export async function removeTgMemberFromGroup(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const tgMember = await tgMembersUseCases.deleteTgMemberByIdUseCase.execute(id);

        if (!tgMember) {
            const error = new Error('Telegram group member not found');
            return sendErrorResponse(res, 404, 'Telegram group member not found', error);
        }


        // TODO: A background task to remove user from the telegram group using Telegram's API


        res.status(200).json({
            status: 'SUCCESS',
            message: "Member removed from group successfully",
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}