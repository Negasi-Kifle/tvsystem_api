import { AddMemberToTelegramGroupUseCase } from '../../application/use-cases/telegram-group-members/add-member-to-tg-group.use-case';
import { AddUserToTelegramGroupDto } from '../dtos/requests/tg-group-member/add-user-to-tg-group.dto';
import { NextFunction, Request, Response } from 'express';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { FetchAllTgMembersDto } from '../dtos/requests/tg-group-member/fetch-all-tg-members.dto';
import { FindTelegramGroupMemberByIdUseCase } from '../../application/use-cases/telegram-group-members/find-by-id.use-case';
import { RemoveMemberFromTelegramGroupUseCase } from '../../application/use-cases/telegram-group-members/remove-member-from-teg';
import { mapFetchAllTgMembersDtoToQueryOptions } from '../mappers/teg-member-to-query-options.mapper';
import { CountTelegramGroupMembersUseCase } from '../../application/use-cases/telegram-group-members/count-tg-members.use-case';
import { FetchAllTelegramGroupMembersUseCase } from '../../application/use-cases/telegram-group-members/fetch-all.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createTelegramGroupMemberHandlers(
  deps: Pick<
    ApiRouterDeps,
    'telegramGroupMemberRepository' | 'telegramGroupRepository' | 'userRepository'
  >,
) {
  const { telegramGroupMemberRepository, telegramGroupRepository, userRepository } = deps;

  const addMemberToTelegramGroupUseCase = new AddMemberToTelegramGroupUseCase(
    telegramGroupMemberRepository,
    telegramGroupRepository,
    userRepository,
  );
  const findTelegramGroupMemberByIdUseCase = new FindTelegramGroupMemberByIdUseCase(
    telegramGroupMemberRepository,
  );
  const removeMemberFromTelegramGroupUseCase = new RemoveMemberFromTelegramGroupUseCase(
    telegramGroupMemberRepository,
  );
  const fetchAllTelegramGroupMembersUseCase = new FetchAllTelegramGroupMembersUseCase(
    telegramGroupMemberRepository,
  );
  const countTelegramGroupMembersUseCase = new CountTelegramGroupMembersUseCase(
    telegramGroupMemberRepository,
  );

  async function addUserToTelegramGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as AddUserToTelegramGroupDto;
      const telegramGroupMember = await addMemberToTelegramGroupUseCase.execute(
        payload.userId,
        payload.telegramGroupId,
      );

      res.status(201).json({
        status: 'SUCCESS',
        message: 'User added to telegram group successfully',
        data: { telegramGroupMember },
      });
    } catch (error) {
      next(error);
    }
  }

  async function findManyTelegramGroupMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllTgMembersDto;
      const queryOptions = mapFetchAllTgMembersDtoToQueryOptions(query);

      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [telegramGroupMembers, total] = await Promise.all([
        fetchAllTelegramGroupMembersUseCase.execute(queryOptions),
        countTelegramGroupMembersUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { telegramGroupMembers },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getTgMemberById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const telegramGroupMember = await findTelegramGroupMemberByIdUseCase.execute(id);
      if (!telegramGroupMember) {
        const err = new Error('Telegram group member not found');
        return sendErrorResponse(res, 404, 'Telegram group member not found', err);
      }

      res.status(200).json({
        status: 'SUCCESS',
        data: { telegramGroupMember },
      });
    } catch (error) {
      next(error);
    }
  }

  async function removeTgMemberFromGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await removeMemberFromTelegramGroupUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Member removed from group successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    addUserToTelegramGroup,
    findManyTelegramGroupMembers,
    getTgMemberById,
    removeTgMemberFromGroup,
  };
}
