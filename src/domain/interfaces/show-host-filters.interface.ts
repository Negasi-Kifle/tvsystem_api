import { ShowHostEntity } from '../entities/show-host.entity';
import { RevenueShareType } from '../enums';

export type ShowHostFilters = Partial<ShowHostEntity> & {
  showId?: string;
  userId?: string;
  revenueShareType?: RevenueShareType;
  isPrimary?: boolean;
};

