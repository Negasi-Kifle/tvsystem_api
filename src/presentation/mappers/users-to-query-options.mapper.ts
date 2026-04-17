import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { FetchAllUsersDto } from '../dtos/requests/user/fetch-all-users.dto';

/**
 * Maps the fetch-all-users request DTO to repo QueryOptions.
 * Reusable from any handler that has a validated FetchAllUsersDto.
 */
export function mapFetchAllUsersDtoToQueryOptions(dto: FetchAllUsersDto): QueryOptions<UserEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.email != null && { email: dto.email }),
      ...(dto.phoneNumber != null && { phoneNumber: dto.phoneNumber }),
      ...(dto.roles != null && { roles: dto.roles }),
      ...(dto.isActive != null && { isActive: dto.isActive }),
      ...(dto.sex != null && { sex: dto.sex }),
      ...(dto.isFirstTimeAccount != null && { isFirstTimeAccount: dto.isFirstTimeAccount }),
    },
  };
}
