import { ShowEntity } from '../entities/show.entity';
import { ShowType } from '../enums/show-type.enum';

export type ShowFilters = Partial<ShowEntity> & {
  id?: string | string[];
  title?: string;
  titleSlug?: string;
  type?: ShowType;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  minAdLengthMinutes?: number;
  maxAdLengthMinutes?: number;
  minTotalDurationMinutes?: number;
  maxTotalDurationMinutes?: number;
};
