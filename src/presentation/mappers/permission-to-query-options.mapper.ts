import { QueryOptions } from '../../domain/interfaces/query-options.interface';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { FetchAllPermissionsDto } from '../dtos/requests/permission/fetch-all-permissions.dto';
import { Prisma } from '../../infrastructure/prisma/generated/client';

/**
 * Maps the fetch-all-permissions request DTO to repo QueryOptions.
 * Reusable from any handler that has a validated FetchAllPermissionsDto.
 */
export function mapFetchAllPermissionsDtoToQueryOptions(dto: FetchAllPermissionsDto): QueryOptions<PermissionEntity> {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
    filters: {
      ...(dto.name != null && { name: dto.name }),
      ...(dto.nameSlug != null && { nameSlug: dto.nameSlug }),
      ...(dto.description != null && { description: dto.description }),
      ...(dto.isSystemPermission != null && { isSystemPermission: dto.isSystemPermission }),
    },
  };
}
