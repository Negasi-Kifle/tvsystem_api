import { AdvertStatus } from '../enums/advert-status.enum';

export interface Advert {
  id: string;
  showId: string;
  customerId: string;
  status: AdvertStatus;
  slot?: { start: Date; end: Date };
  contractDetails?: string;
  createdAt?: Date;
}
