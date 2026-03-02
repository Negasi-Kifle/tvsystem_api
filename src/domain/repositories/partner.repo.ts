import { Partner } from '../entities/partner.entity';

export interface IPartnerRepository {
  findById(id: string): Promise<Partner | null>;
  deleteById(id: string): Promise<Partner | null>;
  update(partner: Partner): Promise<Partner | null>;
}
