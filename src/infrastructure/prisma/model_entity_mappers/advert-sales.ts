import { Prisma } from '../generated/client';
import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../domain/enums/advert-type.enum';
import { modelToEntity as advertPackageModelToEntity } from './advert-package';
import { modelToEntity as customerModelToEntity, type CustomerWithRelations } from './customer';
import { modelToEntity as userModelToEntity } from './user';
import { modelToEntity as categoryModelToEntity } from './category';
import { modelToEntity as subCategoryModelToEntity } from './sub-category';

export const advertSalesReadInclude = {
  advertPackage: true,
  customer: true,
  salesRep: true,
  salesAgent: true,
  category: true,
  subCategory: true,
} as const;

type AdvertSalesWithRelations = Prisma.AdvertSalesGetPayload<{
  include: typeof advertSalesReadInclude;
}>;

type AdvertSalesLike = Prisma.AdvertSalesGetPayload<Record<string, never>> &
  Partial<{
    advertPackage: AdvertSalesWithRelations['advertPackage'];
    customer: AdvertSalesWithRelations['customer'];
    salesRep: AdvertSalesWithRelations['salesRep'];
    salesAgent: AdvertSalesWithRelations['salesAgent'];
    category: AdvertSalesWithRelations['category'];
    subCategory: AdvertSalesWithRelations['subCategory'];
  }>;

export function modelToEntity(model: AdvertSalesLike): AdvertSalesEntity {
  const adPackage = model.advertPackage
    ? advertPackageModelToEntity(model.advertPackage)
    : undefined;
  const customer = model.customer
    ? customerModelToEntity(model.customer as CustomerWithRelations)
    : undefined;
  const salesRep = model.salesRep ? userModelToEntity(model.salesRep) : undefined;
  const salesAgent = model.salesAgent ? userModelToEntity(model.salesAgent) : undefined;
  const category = model.category ? categoryModelToEntity(model.category) : undefined;
  const subCategory = model.subCategory ? subCategoryModelToEntity(model.subCategory) : undefined;

  return AdvertSalesEntity.createInstance(
    model.advertPackageId,
    model.customerId,
    model.status as AdvertSalesStatus,
    (model.advertType ?? 'Paid') as AdvertType,
    model.adStartDate,
    model.adEndDate,
    model.adLengthSeconds,
    model.numOfSlots,
    model.adPackagePrice,
    model.discountPercentage,
    model.finalPrice,
    model.installmentCount,
    model.campaignName,
    model.contractSignDate,
    model.referenceNumber,
    model.salesRepId,
    model.salesRepCommissionPercentage,
    model.categoryId,
    model.subCategoryId,
    model.salesAgentId,
    model.salesAgentCommissionPercentage,
    model.festiveSeason,
    model.referralSource,
    model.notes,
    model.campaignEndAlertSentAt ?? null,
    model.createdAt,
    model.updatedAt,
    model.id,
    adPackage,
    customer,
    salesRep,
    salesAgent,
    category,
    subCategory,
  );
}

export function entityToModel(
  entity: AdvertSalesEntity,
): Prisma.AdvertSalesUncheckedCreateInput {
  return {
    id: entity.id,
    referenceNumber: entity.referenceNumber,
    advertPackageId: entity.adPackageId,
    customerId: entity.customerId,
    status: entity.status,
    advertType: entity.advertType,
    adStartDate: entity.adStartDate,
    adEndDate: entity.adEndDate,
    adLengthSeconds: entity.adLengthSeconds,
    numOfSlots: entity.numOfSlots,
    adPackagePrice: entity.adPackagePrice,
    discountPercentage: entity.discountPercentage,
    finalPrice: entity.finalPrice,
    installmentCount: entity.installmentCount,
    campaignName: entity.campaignName,
    contractSignDate: entity.contractSignDate,
    salesRepId: entity.salesRepId ?? null,
    salesRepCommissionPercentage: entity.salesRepCommissionPercentage,
    categoryId: entity.categoryId ?? null,
    subCategoryId: entity.subCategoryId ?? null,
    salesAgentId: entity.salesAgentId ?? null,
    salesAgentCommissionPercentage: entity.salesAgentCommissionPercentage,
    festiveSeason: entity.festiveSeason ?? null,
    referralSource: entity.referralSource ?? null,
    notes: entity.notes ?? null,
    campaignEndAlertSentAt: entity.campaignEndAlertSentAt ?? null,
  };
}
