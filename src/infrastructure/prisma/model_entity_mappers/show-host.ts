import { ShowHost } from '../generated/client';
import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { RevenueShareType } from '../../../domain/enums';
import { modelToEntity as mapShowToEntity } from './show';
import { modelToEntity as mapUserToEntity } from './user';
import { Prisma } from '../generated/client';

type ShowHostWithRelations = Prisma.ShowHostGetPayload<{
  include: { show: true; user: true };
}>;

type ShowHostLike = Prisma.ShowHostGetPayload<{}> | ShowHostWithRelations;

export function modelToEntity(showHost: ShowHostLike): ShowHostEntity {
  return ShowHostEntity.createInstance(
    showHost.userId,
    showHost.showId,
    showHost.revenueShareType as RevenueShareType | undefined,
    showHost.revenueShareValue ?? undefined,
    showHost.isPrimary ?? false,
    showHost.createdAt,
    showHost.updatedAt,
    showHost.id,
    'show' in showHost && showHost.show
      ? mapShowToEntity(showHost.show)
      : undefined,
    'user' in showHost && showHost.user
      ? mapUserToEntity(showHost.user)
      : undefined,
  );
}

export function entityToModel(showHost: ShowHostEntity): ShowHost {
  return {
    id: showHost.id ?? '',
    showId: showHost.showId,
    userId: showHost.userId,
    revenueShareType: showHost.revenueShareType ?? null,
    revenueShareValue: showHost.revenueShareValue ?? null,
    isPrimary: showHost.isPrimary ?? false,
    createdAt: showHost.createdAt ?? new Date(),
    updatedAt: showHost.updatedAt ?? new Date(),
  };
}

