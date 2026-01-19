import { CreateTelegramGroupDto } from "../dtos/requests/create-tg.dto";
import { TelegramGroupsUseCases } from "../../application/use-cases/telegram-groups";
import { Request, Response } from "express";
import { sendErrorResponse } from "../../shared/utils/error-handler";
import { FetchAllTgGroupsDto } from "../dtos/requests/fetch-all-tg-groups.dto";
import { UpdateTelegramGroupDto } from "../dtos/requests/update-tg-group.dto";

const telegramGroupsUseCases = new TelegramGroupsUseCases();

export async function createTelegramGroup(req: Request, res: Response) {
    try {
        const payload = req.body as CreateTelegramGroupDto;

        const completePayload = {
            ...payload,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const telegramGroup = await telegramGroupsUseCases.createTgGroupUseCase.execute(completePayload);


        res.status(201).json({
            status: 'SUCCESS',
            message: 'Telegram group created successfully',
            data: { telegramGroup }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}


export async function getTelegramGroupById(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const telegramGroup = await telegramGroupsUseCases.getTgGroupByIdUseCase.execute(id);
        if (!telegramGroup) {
            const error = new Error('Telegram group not found');
            return sendErrorResponse(res, 404, 'Telegram group not found', error);
        }


        res.status(200).json({
            status: 'SUCCESS',
            data: { telegramGroup }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}


export async function fetchAllTelegramGroups(req: Request, res: Response) {
    try {
        const query = res.locals.query as FetchAllTgGroupsDto;
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const [telegramGroups, total] = await Promise.all([
            telegramGroupsUseCases.fetchAllTgGroupsUseCase.execute(query),
            telegramGroupsUseCases.countTgGroupsUseCase.execute(query)
        ]);

        res.status(200).json({
            status: 'SUCCESS',
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            data: { telegramGroups }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}


export async function updateTelegramGroup(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const payload = req.body as UpdateTelegramGroupDto;
        const telegramGroup = await telegramGroupsUseCases.updateTgGroupUseCase.execute(id, payload);

        if (!telegramGroup) {
            const error = new Error('Telegram group not found');
            return sendErrorResponse(res, 404, 'Telegram group not found', error);
        }

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Telegram group updated successfully',
            data: { telegramGroup }
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}
export async function deleteTelegramGroup(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const telegramGroup = await telegramGroupsUseCases.deleteTgGroupUseCase.execute(id);
        if (!telegramGroup) {
            const error = new Error('Telegram group not found');
            return sendErrorResponse(res, 404, 'Telegram group not found', error);
        }

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Telegram group deleted successfully',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return sendErrorResponse(res, 400, errorMessage, error as Error);
    }
}