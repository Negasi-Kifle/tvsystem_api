import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserPermissionEntity } from '../../domain/entities/user-permissions.entity';
import { FetchAllUserPermissionsDto } from '../dtos/requests/user-permission/fetch-all-user-permissions.dto';

/**
 * Maps the fetch-all-user-permissions request DTO to repo QueryOptions.
 * Reusable from any handler that has a validated FetchAllUserPermissionsDto.
 */
export function mapFetchAllUserPermissionsDtoToQueryOptions(dto: FetchAllUserPermissionsDto): QueryOptions<UserPermissionEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.userId != null && { userId: dto.userId }),
      ...(dto.permissionId != null && { permissionId: dto.permissionId }),
      ...(dto.grantedBy != null && { grantedBy: dto.grantedBy }),
      ...(dto.expiresAt != null && { expiresAt: dto.expiresAt }),
    },
  };
}
