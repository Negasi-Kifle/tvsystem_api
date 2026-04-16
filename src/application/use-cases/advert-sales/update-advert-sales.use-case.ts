import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../domain/enums/advert-type.enum';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { computeStoredAgentCommissionPercentage } from '../../../domain/services/sales-commission-storage';

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
  installmentCount?: number;
  campaignName?: string;
  contractSignDate?: Date;
  salesRepId?: string | null;
  salesRepCommissionPercentage?: number;
  categoryId?: string | null;
  subCategoryId?: string | null;
  salesAgentId?: string | null;
  salesAgentCommissionPercentage?: number;
  festiveSeason?: string | null;
  referralSource?: string | null;
  notes?: string | null;
};

export class UpdateAdvertSalesUseCase {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPackageRepo: IAdvertPackageRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly userRepository: IUserRepository,
    private readonly categoryRepo: ICategoryRepository,
    private readonly subCategoryRepo: ISubCategoryRepository,
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

    const installmentCount =
      patch.installmentCount !== undefined ? patch.installmentCount : existing.installmentCount;
    if (!Number.isInteger(installmentCount) || installmentCount < 1) {
      throw new ValidationError('Installment count must be an integer of at least 1');
    }

    const mergedCategoryId =
      patch.categoryId !== undefined ? patch.categoryId : existing.categoryId;
    const mergedSubCategoryId =
      patch.subCategoryId !== undefined ? patch.subCategoryId : existing.subCategoryId;

    const { categoryId, subCategoryId } = await this.resolveMergedCategoryPair(
      mergedCategoryId,
      mergedSubCategoryId,
    );

    const salesRepId = patch.salesRepId !== undefined ? patch.salesRepId : existing.salesRepId;
    const salesAgentId =
      patch.salesAgentId !== undefined ? patch.salesAgentId : existing.salesAgentId;

    const finalPriceChanged = Math.abs(finalPrice - existing.finalPrice) > 0.01;

    let salesRepCommissionPercentage =
      patch.salesRepCommissionPercentage !== undefined
        ? patch.salesRepCommissionPercentage
        : existing.salesRepCommissionPercentage;

    let salesAgentCommissionPercentage =
      patch.salesAgentCommissionPercentage !== undefined
        ? patch.salesAgentCommissionPercentage
        : existing.salesAgentCommissionPercentage;

    const recomputeRepPct =
      patch.salesRepCommissionPercentage === undefined &&
      (patch.salesRepId !== undefined || finalPriceChanged);

    const recomputeAgentPct =
      patch.salesAgentCommissionPercentage === undefined &&
      (patch.salesAgentId !== undefined || finalPriceChanged);

    if (recomputeRepPct) {
      if (salesRepId) {
        const repUser = await this.userRepository.findById(salesRepId);
        if (!repUser) {
          throw new EntityNotFoundError('Sales rep user not found', 'User', salesRepId);
        }
        if (
          repUser.salesCommissionType === undefined ||
          repUser.salesCommissionAmount === undefined
        ) {
          throw new ValidationError(
            'The sales rep has not been assigned a sales commission type and amount. Please contact the administrator.',
          );
        }
        salesRepCommissionPercentage = computeStoredAgentCommissionPercentage(
          repUser.salesCommissionType,
          repUser.salesCommissionAmount,
          finalPrice,
        );
      } else {
        salesRepCommissionPercentage = 0;
      }
    }

    if (recomputeAgentPct) {
      if (salesAgentId) {
        const agentUser = await this.userRepository.findById(salesAgentId);
        if (!agentUser) {
          throw new EntityNotFoundError('Sales agent user not found', 'User', salesAgentId);
        }
        if (
          agentUser.salesCommissionType === undefined ||
          agentUser.salesCommissionAmount === undefined
        ) {
          throw new ValidationError(
            'The sales agent has not been assigned a sales commission type and amount. Please contact the administrator.',
          );
        }
        salesAgentCommissionPercentage = computeStoredAgentCommissionPercentage(
          agentUser.salesCommissionType,
          agentUser.salesCommissionAmount,
          finalPrice,
        );
      } else {
        salesAgentCommissionPercentage = 0;
      }
    }

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
      installmentCount,
      patch.campaignName ?? existing.campaignName,
      patch.contractSignDate ?? existing.contractSignDate,
      salesRepId,
      salesRepCommissionPercentage,
      categoryId,
      subCategoryId,
      salesAgentId,
      salesAgentCommissionPercentage,
      patch.festiveSeason !== undefined ? patch.festiveSeason : existing.festiveSeason,
      patch.referralSource !== undefined ? patch.referralSource : existing.referralSource,
      patch.notes !== undefined ? patch.notes : existing.notes,
      existing.campaignEndAlertSentAt,
      existing.createdAt,
      existing.updatedAt,
      existing.id,
      existing.adPackage,
      existing.customer,
      existing.salesRep,
      existing.salesAgent,
      existing.category,
      existing.subCategory,
    );

    return this.advertSalesRepo.update(updated);
  }

  private async resolveMergedCategoryPair(
    mergedCategoryId: string | null | undefined,
    mergedSubCategoryId: string | null | undefined,
  ): Promise<{ categoryId: string | null; subCategoryId: string | null }> {
    if (mergedSubCategoryId) {
      const sub = await this.subCategoryRepo.findById(mergedSubCategoryId);
      if (!sub) {
        throw new EntityNotFoundError('Sub-category not found', 'SubCategory', mergedSubCategoryId);
      }
      if (mergedCategoryId && sub.categoryId !== mergedCategoryId) {
        throw new ValidationError('Sub-category does not belong to the given category');
      }
      return {
        categoryId: (mergedCategoryId ?? sub.categoryId) ?? null,
        subCategoryId: mergedSubCategoryId,
      };
    }

    if (mergedCategoryId) {
      const cat = await this.categoryRepo.findById(mergedCategoryId);
      if (!cat) {
        throw new EntityNotFoundError('Category not found', 'Category', mergedCategoryId);
      }
      return { categoryId: mergedCategoryId, subCategoryId: null };
    }

    return { categoryId: null, subCategoryId: null };
  }
}
