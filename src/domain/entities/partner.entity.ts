import { Percentage } from '../value-objects/percentage.value-object';
import { UserEntity } from './user.entity';

export class PartnerEntity {
  constructor(
    public revenueShare: Percentage,
    public isActive: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public user?: UserEntity,
  ) { }

  public static createInstance(
    revenueShare: Percentage,
    isActive: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    user?: UserEntity,
  ): PartnerEntity {
    return new PartnerEntity(
      revenueShare, 
      isActive, 
      createdAt, 
      updatedAt, 
      id,
      user,
    );
  }

  
  public updateInstance(revenueShare?: Percentage, isActive?: boolean): PartnerEntity {
    if (revenueShare !== undefined) this.revenueShare = revenueShare;
    if (isActive !== undefined) this.isActive = isActive;

    this.updatedAt = new Date();
    return this;
  }
}
