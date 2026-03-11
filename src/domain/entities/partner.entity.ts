
import { UserEntity } from './user.entity';

export class PartnerEntity {
  constructor(
    public isActive: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public user?: UserEntity,
  ) { }

  public static createInstance(
    isActive: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    user?: UserEntity,
  ): PartnerEntity {
    return new PartnerEntity(
      isActive, 
      createdAt, 
      updatedAt, 
      id,
      user,
    );
  }

  
  public updateInstance(isActive?: boolean): PartnerEntity {
    if (isActive !== undefined) this.isActive = isActive;

    this.updatedAt = new Date();
    return this;
  }
}
