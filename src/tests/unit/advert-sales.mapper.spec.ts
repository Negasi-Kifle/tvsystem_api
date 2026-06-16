import { describe, expect, it } from '@jest/globals';
import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { entityToModel, modelToEntity } from '../../infrastructure/prisma/model_entity_mappers/advert-sales';

describe('advert-sales mapper', () => {
  it('round-trips priceInUSD between entity and model', () => {
    const entity = AdvertSalesEntity.createInstance(
      'pkg-id',
      'cust-id',
      AdvertSalesStatus.Pending,
      AdvertType.Paid,
      new Date('2026-01-01'),
      new Date('2026-01-10'),
      30,
      1,
      10000,
      0,
      9000,
      1,
      'Campaign',
      new Date('2025-12-01'),
      'REF-1',
      null,
      0,
      null,
      null,
      null,
      0,
      undefined,
      undefined,
      undefined,
      125.75,
    );

    const model = entityToModel(entity);
    expect(model.priceInUSD).toBe(125.75);

    const roundTripped = modelToEntity({
      ...model,
      id: 'sale-id',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-02'),
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
      referenceNumber: entity.referenceNumber,
      salesRepId: null,
      salesRepCommissionPercentage: 0,
      categoryId: null,
      subCategoryId: null,
      salesAgentId: null,
      salesAgentCommissionPercentage: 0,
      festiveSeason: null,
      referralSource: null,
      notes: null,
      priceInUSD: 125.75,
      campaignEndAlertSentAt: null,
    });

    expect(roundTripped.priceInUSD).toBe(125.75);
  });
});
