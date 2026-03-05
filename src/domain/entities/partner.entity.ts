import { Percentage } from '../value-objects/percentage.value-object';

export class PartnerEntity {
  constructor(
    private name: string,
    private revenueShare: Percentage,
    private isActive: boolean,
    private createdAt?: Date,
    private updatedAt?: Date,
    private id?: string,
  ) { }

  public static createInstance(
    name: string,
    revenueShare: Percentage,
    isActive: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): PartnerEntity {
    return new PartnerEntity(name, revenueShare, isActive, createdAt, updatedAt, id);
  }

  public updateInstance(name?: string, revenueShare?: Percentage, isActive?: boolean): PartnerEntity {
    if (name !== undefined) this.name = name;
    if (revenueShare !== undefined) this.revenueShare = revenueShare;
    if (isActive !== undefined) this.isActive = isActive;

    this.updatedAt = new Date();
    return this;
  }
}
