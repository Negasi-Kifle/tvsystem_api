import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { FetchAllTgMembersDto } from '../dtos/requests/fetch-all-tg-members.dto';
import { TelegramGroupMemberEntity } from '../../domain/entities/telegram-group-member.entity';

/**
 * Maps the fetch-all-users request DTO to repo QueryOptions.
 * Reusable from any handler that has a validated FetchAllUsersDto.
 */
export function mapFetchAllTgMembersDtoToQueryOptions(dto: FetchAllTgMembersDto): QueryOptions<TelegramGroupMemberEntity> {
  return {
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
    filters: {
      ...(dto.userId != null && { userId: dto.userId }),
      ...(dto.telegramGroupId != null && { telegramGroupId: dto.telegramGroupId }),
    },
  };
}
