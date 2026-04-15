import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../domain/enums/advert-type.enum';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';

export type UpdateAdvertSalesInput = {
  adPackageId?: string;
  customerId?: string;
  status?: AdvertSalesStatus;
  advertType?: AdvertType;
  adStartDate?: Date;
  adEndDate?: Date;
  adLengthSeconds?: number;
  numOfSlots?: number;
  adPackagePrice?: number;
  discountPercentage?: number;
  finalPrice?: number;
  campaignName?: string;
  contractSignDate?: Date;
  salesAgentId?: string | null;
  agentCommissionPercentage?: number;
  industry?: string | null;
  festiveSeason?: string | null;
  referralSource?: string | null;
  advertAgency?: string | null;
  notes?: string | null;
};

export class UpdateAdvertSalesUseCase {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPackageRepo: IAdvertPackageRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string, patch: UpdateAdvertSalesInput): Promise<AdvertSalesEntity | null> {
    const existing = await this.advertSalesRepo.findById(id);
    if (!existing || !existing.id) {
      throw new EntityNotFoundError('Advert sales not found', 'AdvertSales', id);
    }

    const adPackageId = patch.adPackageId ?? existing.adPackageId;
    const customerId = patch.customerId ?? existing.customerId;
    let adPackagePrice = existing.adPackagePrice;

    if (patch.adPackageId !== undefined) {
      const pkg = await this.advertPackageRepo.findById(adPackageId);
      if (!pkg) {
        throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', adPackageId);
      }
      adPackagePrice = pkg.finalPrice;
    }
    if (patch.adPackagePrice !== undefined) {
      adPackagePrice = patch.adPackagePrice;
    }
    if (patch.customerId !== undefined) {
      const customer = await this.customerRepo.findById(customerId);
      if (!customer) {
        throw new EntityNotFoundError('Customer not found', 'Customer', customerId);
      }
    }

    const discountPercentage = patch.discountPercentage ?? existing.discountPercentage;
    const calculatedFinal = adPackagePrice * (1 - discountPercentage / 100);
    if (
      patch.finalPrice !== undefined &&
      Math.abs(patch.finalPrice - calculatedFinal) > 0.01
    ) {
      throw new ValidationError('Final price does not match the calculated price');
    }
    const finalPrice = calculatedFinal;

    const updated = new AdvertSalesEntity(
      existing.referenceNumber,
      adPackageId,
      customerId,
      patch.status ?? existing.status,
      patch.advertType ?? existing.advertType,
      patch.adStartDate ?? existing.adStartDate,
      patch.adEndDate ?? existing.adEndDate,
      patch.adLengthSeconds !== undefined ? patch.adLengthSeconds : existing.adLengthSeconds,
      patch.numOfSlots !== undefined ? patch.numOfSlots : existing.numOfSlots,
      adPackagePrice,
      patch.discountPercentage !== undefined ? patch.discountPercentage : existing.discountPercentage,
      finalPrice,
      patch.campaignName ?? existing.campaignName,
      patch.contractSignDate ?? existing.contractSignDate,
      patch.salesAgentId !== undefined ? patch.salesAgentId : existing.salesAgentId,
      patch.agentCommissionPercentage !== undefined ? patch.agentCommissionPercentage : existing.agentCommissionPercentage,
      patch.industry !== undefined ? patch.industry : existing.industry,
      patch.festiveSeason !== undefined ? patch.festiveSeason : existing.festiveSeason,
      patch.referralSource !== undefined ? patch.referralSource : existing.referralSource,
      patch.advertAgency !== undefined ? patch.advertAgency : existing.advertAgency,
      patch.notes !== undefined ? patch.notes : existing.notes,
      existing.createdAt,
      existing.updatedAt,
      existing.id,
    );

    return this.advertSalesRepo.update(updated);
  }
}
