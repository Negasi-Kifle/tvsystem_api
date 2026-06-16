import { ValidationError } from '../errors/validation.error';
import { AdvertSalesStatus } from '../enums/advert-sales.enum';
import { AdvertType } from '../enums/advert-type.enum';
import { AdvertPackageEntity } from './advert-package.entity';
import { CategoryEntity } from './category.entity';
import { CustomerEntity } from './customer.entity';
import type { SubCategoryEntity } from './sub-category.entity';
import type { UserEntity } from './user.entity';

export class AdvertSalesEntity {
  constructor(
    public referenceNumber: string,
    public adPackageId: string,
    public customerId: string,
    public status: AdvertSalesStatus = AdvertSalesStatus.Pending,
    public advertType: AdvertType = AdvertType.Paid,
    public adStartDate: Date,
    public adEndDate: Date,
    public adLengthSeconds: number,
    public numOfSlots: number,
    public adPackagePrice: number,
    public discountPercentage: number,
    public finalPrice: number,
    public installmentCount: number = 1,
    public campaignName: string,
    public contractSignDate: Date,
    public salesRepId?: string | null,
    public salesRepCommissionPercentage: number = 0,
    public categoryId?: string | null,
    public subCategoryId?: string | null,
    public salesAgentId?: string | null,
    public salesAgentCommissionPercentage: number = 0,
    public festiveSeason?: string | null,
    public referralSource?: string | null,
    public notes?: string | null,
    public priceInUSD?: number | null,
    public campaignEndAlertSentAt?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public adPackage?: AdvertPackageEntity,
    public customer?: CustomerEntity,
    public salesRep?: UserEntity,
    public salesAgent?: UserEntity,
    public category?: CategoryEntity,
    public subCategory?: SubCategoryEntity,
  ) {}

  public static createInstance(
    adPackageId: string,
    customerId: string,
    status: AdvertSalesStatus = AdvertSalesStatus.Pending,
    advertType: AdvertType = AdvertType.Paid,
    adStartDate: Date,
    adEndDate: Date,
    adLengthSeconds: number,
    numOfSlots: number,
    adPackagePrice: number,
    discountPercentage: number = 0,
    finalPrice: number,
    installmentCount: number = 1,
    campaignName: string,
    contractSignDate: Date,
    referenceNumber: string,
    salesRepId?: string | null,
    salesRepCommissionPercentage: number = 0,
    categoryId?: string | null,
    subCategoryId?: string | null,
    salesAgentId?: string | null,
    salesAgentCommissionPercentage: number = 0,
    festiveSeason?: string | null,
    referralSource?: string | null,
    notes?: string | null,
    priceInUSD?: number | null,
    campaignEndAlertSentAt: Date | null | undefined = undefined,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    adPackage?: AdvertPackageEntity,
    customer?: CustomerEntity,
    salesRep?: UserEntity,
    salesAgent?: UserEntity,
    category?: CategoryEntity,
    subCategory?: SubCategoryEntity,
  ): AdvertSalesEntity {
    if (!adPackageId?.trim()) {
      throw new ValidationError('Ad package Id is required');
    }
    if (!customerId?.trim()) {
      throw new ValidationError('Customer Id is required');
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new ValidationError('Discount percentage must be between 0 and 100');
    }
    if (!Number.isInteger(installmentCount) || installmentCount < 1) {
      throw new ValidationError('Installment count must be an integer of at least 1');
    }
    if (salesRepCommissionPercentage < 0 || salesRepCommissionPercentage > 100) {
      throw new ValidationError('Sales rep commission percentage must be between 0 and 100');
    }
    if (salesAgentCommissionPercentage < 0 || salesAgentCommissionPercentage > 100) {
      throw new ValidationError('Sales agent commission percentage must be between 0 and 100');
    }
    if (priceInUSD != null && (!Number.isFinite(priceInUSD) || priceInUSD < 0)) {
      throw new ValidationError('Price in USD must be a non-negative number');
    }
    return new AdvertSalesEntity(
      referenceNumber,
      adPackageId.trim(),
      customerId.trim(),
      status,
      advertType,
      adStartDate,
      adEndDate,
      adLengthSeconds,
      numOfSlots,
      adPackagePrice,
      discountPercentage,
      finalPrice,
      installmentCount,
      campaignName,
      contractSignDate,
      salesRepId,
      salesRepCommissionPercentage,
      categoryId,
      subCategoryId,
      salesAgentId,
      salesAgentCommissionPercentage,
      festiveSeason,
      referralSource,
      notes,
      priceInUSD ?? null,
      campaignEndAlertSentAt ?? null,
      createdAt,
      updatedAt,
      id,
      adPackage,
      customer,
      salesRep,
      salesAgent,
      category,
      subCategory,
    );
  }
}
