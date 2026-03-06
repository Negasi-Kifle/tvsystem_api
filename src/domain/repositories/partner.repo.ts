import { PartnerEntity } from '../entities/partner.entity';
import { IBaseRepository } from './base.repository.interface';
import { UserEntity } from '../entities/user.entity';

export interface IPartnerRepository extends IBaseRepository<PartnerEntity> {
 
  createPartnerAndUser(
    partner: PartnerEntity,
    user: UserEntity,
    permissionIds: string[],
    grantedBy?: string,
  ): Promise<{ partner: PartnerEntity, user: UserEntity}>;

  updatePartnerAndUserStatus(
    partner: PartnerEntity,
    user: UserEntity,
  ): Promise<{ partner: PartnerEntity, user: UserEntity }>;
}
