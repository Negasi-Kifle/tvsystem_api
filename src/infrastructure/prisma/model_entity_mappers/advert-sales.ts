import { Prisma } from '../generated/client';
import { AdvertSalesEntity } from '../../../domain/entities/adver-sales.entity';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../domain/enums/advert-type.enum';
import { modelToEntity as advertPackageModelToEntity } from './advert-package';
import { modelToEntity as customerModelToEntity, type CustomerWithRelations } from './customer';

export const advertSalesReadInclude = {
  advertPackage: true,
  customer: true,
} as const;

type AdvertSalesWithRelations = Prisma.AdvertSalesGetPayload<{
  include: typeof advertSalesReadInclude;
}>;

type AdvertSalesLike = Prisma.AdvertSalesGetPayload<Record<string, never>> &
  Partial<{
    advertPackage: AdvertSalesWithRelations['advertPackage'];
    customer: AdvertSalesWithRelations['customer'];
  }>;

export function modelToEntity(model: AdvertSalesLike): AdvertSalesEntity {
  const adPackage = model.advertPackage
    ? advertPackageModelToEntity(model.advertPackage)
    : undefined;
  const customer = model.customer
    ? customerModelToEntity(model.customer as CustomerWithRelations)
    : undefined;

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
    model.campaignName,
    model.contractSignDate,
    model.referenceNumber,
    model.salesAgentId,
    model.agentCommissionPercentage,
    model.industry,
    model.festiveSeason,
    model.referralSource,
    model.advertAgency,
    model.notes,
    model.createdAt,
    model.updatedAt,
    model.id,
    adPackage,
    customer,
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
    campaignName: entity.campaignName,
    contractSignDate: entity.contractSignDate,
    salesAgentId: entity.salesAgentId ?? null,
    agentCommissionPercentage: entity.agentCommissionPercentage,
    industry: entity.industry ?? null,
    festiveSeason: entity.festiveSeason ?? null,
    referralSource: entity.referralSource ?? null,
    advertAgency: entity.advertAgency ?? null,
    notes: entity.notes ?? null,
  };
}
