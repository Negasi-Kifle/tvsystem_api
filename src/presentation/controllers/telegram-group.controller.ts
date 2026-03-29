import { CreateTelegramGroupDto } from '../dtos/requests/telegram-group/create-tg.dto';
import { NextFunction, Request, Response } from 'express';
import { FetchAllTgGroupsDto } from '../dtos/requests/telegram-group/fetch-all-tg-groups.dto';
import { UpdateTelegramGroupDto } from '../dtos/requests/telegram-group/update-tg-group.dto';
import { CreateTgGroupUseCase } from '../../application/use-cases/telegram-groups/create-tg-group.use-case';
import { GetTgGroupByIdUseCase } from '../../application/use-cases/telegram-groups/get-by-id.use-case';
import { FetchAllTgGroupsUseCase } from '../../application/use-cases/telegram-groups/fetch-all-tg-groups.use-case';
import { CountTgGroupsUseCase } from '../../application/use-cases/telegram-groups/count-tg-groups.use-case';
import { mapFetchAllTgGroupsDtoToQueryOptions } from '../mappers/tg-group-to-query-options.mapper';
import { UpdateTgGroupUseCase } from '../../application/use-cases/telegram-groups/update-tg-group.use-case';
import { DeleteTgGroupUseCase } from '../../application/use-cases/telegram-groups/delete-tg-group.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createTelegramGroupHandlers(deps: Pick<ApiRouterDeps, 'telegramGroupRepository'>) {
  const { telegramGroupRepository } = deps;
  const createTelegramGroupUseCase = new CreateTgGroupUseCase(telegramGroupRepository);
  const getTgGroupByIdUseCase = new GetTgGroupByIdUseCase(telegramGroupRepository);
  const fetchAllTgGroupsUseCase = new FetchAllTgGroupsUseCase(telegramGroupRepository);
  const countTgGroupsUseCase = new CountTgGroupsUseCase(telegramGroupRepository);
  const updateTgGroupUseCase = new UpdateTgGroupUseCase(telegramGroupRepository);
  const deleteTgGroupUseCase = new DeleteTgGroupUseCase(telegramGroupRepository);

  async function createTelegramGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateTelegramGroupDto;

      const telegramGroup = await createTelegramGroupUseCase.execute(payload);

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Telegram group created successfully',
        data: { telegramGroup },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getTelegramGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const telegramGroup = await getTgGroupByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { telegramGroup },
      });
    } catch (error) {
      next(error);
    }
  }

  async function fetchAllTelegramGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllTgGroupsDto;
      const queryOptions = mapFetchAllTgGroupsDtoToQueryOptions(dto);

      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [telegramGroups, total] = await Promise.all([
        fetchAllTgGroupsUseCase.execute(queryOptions),
        countTgGroupsUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { telegramGroups },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateTelegramGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateTelegramGroupDto;

      const telegramGroup = await updateTgGroupUseCase.execute(id, payload);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Telegram group updated successfully',
        data: { telegramGroup },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteTelegramGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteTgGroupUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Telegram group deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    createTelegramGroup,
    getTelegramGroupById,
    fetchAllTelegramGroups,
    updateTelegramGroup,
    deleteTelegramGroup,
  };
}
