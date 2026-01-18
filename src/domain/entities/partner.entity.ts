import { Percentage } from '../value-objects/percentage.value-object';

export interface Partner {
  id: string;
  name: string;
  revenueShare: Percentage;
  createdAt?: Date;
}
