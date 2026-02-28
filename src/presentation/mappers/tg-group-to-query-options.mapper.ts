import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllTgGroupsDto } from '../dtos/requests/telegram-group/fetch-all-tg-groups.dto';
import { TelegramGroupEntity } from '../../domain/entities/telegram-groups.entity';

/**
 * Maps the fetch-all-users request DTO to repo QueryOptions.
 * Reusable from any handler that has a validated FetchAllUsersDto.
 */
export function mapFetchAllTgGroupsDtoToQueryOptions(dto: FetchAllTgGroupsDto): QueryOptions<TelegramGroupEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;
  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.groupName != null && { groupName: dto.groupName }),
      ...(dto.groupChatId != null && { groupChatId: dto.groupChatId }),
      ...(dto.groupLink != null && { groupLink: dto.groupLink }),
      ...(dto.isActive != null && { isActive: dto.isActive }),
    },
  };
}
