import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../domain/enums/advert-type.enum';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';
import { computeStoredAgentCommissionPercentage } from '../../../domain/services/sales-commission-storage';
import { IUserRepository } from '../../../domain/repositories/user.repo';
import { UserRole } from '../../../domain/enums/user-role.enum';

export type CreateAdvertSalesInput = {
  adPackageId: string;
  customerId: string;
  status?: AdvertSalesStatus;
  advertType?: AdvertType;
  adStartDate: Date;
  adEndDate: Date;
  adLengthSeconds: number;
  numOfSlots: number;
  discountPercentage: number;
  campaignName: string;
  contractSignDate: Date;
  salesRepId: string;
  categoryId?: string;
  subCategoryId?: string;
  salesAgentId?: string;
  festiveSeason?: string;
  referralSource?: string;
  notes?: string;
  priceInUSD?: number;
  installmentCount?: number;
};

export class CreateAdvertSalesUseCase {
  constructor(
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPackageRepo: IAdvertPackageRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
    private readonly userRepository: IUserRepository,
    private readonly categoryRepo: ICategoryRepository,
    private readonly subCategoryRepo: ISubCategoryRepository,
  ) {}

  async execute(input: CreateAdvertSalesInput): Promise<AdvertSalesEntity> {
    const advertPackage = await this.advertPackageRepo.findById(input.adPackageId);
    if (!advertPackage) {
      throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', input.adPackageId);
    }

    const customer = await this.customerRepo.findById(input.customerId);
    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', input.customerId);
    }

    const { categoryId, subCategoryId } = await this.resolveCategoryPair(
      input.categoryId,
      input.subCategoryId,
    );

    const referenceNumber = await this.generateBusinessRefService.generateBusinessRef();
    const finalPrice =
      Math.round(advertPackage.finalPrice * (1 - input.discountPercentage / 100) * 100) / 100;

    const salesRep = await this.userRepository.findById(input.salesRepId);
    if (!salesRep) {
      throw new EntityNotFoundError('Sales rep user not found', 'User', input.salesRepId);
    }

    if ((salesRep.salesCommissionType === undefined || salesRep.salesCommissionAmount === undefined) && !salesRep.roles.includes(UserRole.CEO)) {
      throw new ValidationError(
        'Your account has not been assigned a sales commission type and amount. Please contact the administrator.',
      );
    }

    const salesRepCommissionPercentage = computeStoredAgentCommissionPercentage(
      salesRep.salesCommissionType,
      salesRep.salesCommissionAmount,
      finalPrice,
    );

    let salesAgentCommissionPercentage = 0;

    if (input.salesAgentId) {
      const salesAgentUser = await this.userRepository.findById(input.salesAgentId);
      if (!salesAgentUser) {
        throw new EntityNotFoundError('Sales agent user not found', 'User', input.salesAgentId);
      }
      if (
        salesAgentUser.salesCommissionType === undefined ||
        salesAgentUser.salesCommissionAmount === undefined
      ) {
        throw new ValidationError(
          'The selected sales agent has not been assigned a sales commission type and amount. Please contact the administrator.',
        );
      }
      salesAgentCommissionPercentage = computeStoredAgentCommissionPercentage(
        salesAgentUser.salesCommissionType,
        salesAgentUser.salesCommissionAmount,
        finalPrice,
      );
    }

    const entity = AdvertSalesEntity.createInstance(
      input.adPackageId,
      input.customerId,
      input.status ?? AdvertSalesStatus.Pending,
      input.advertType ?? AdvertType.Paid,
      input.adStartDate,
      input.adEndDate,
      input.adLengthSeconds,
      input.numOfSlots,
      advertPackage.finalPrice,
      input.discountPercentage,
      finalPrice,
      input.installmentCount ?? 1,
      input.campaignName,
      input.contractSignDate,
      referenceNumber,
      salesRep.id,
      salesRepCommissionPercentage,
      categoryId ?? null,
      subCategoryId ?? null,
      input.salesAgentId ?? null,
      salesAgentCommissionPercentage,
      input.festiveSeason,
      input.referralSource,
      input.notes,
      input.priceInUSD,
    );
    return this.advertSalesRepo.create(entity);
  }

  private async resolveCategoryPair(
    categoryId?: string,
    subCategoryId?: string,
  ): Promise<{ categoryId?: string; subCategoryId?: string }> {
    if (subCategoryId) {
      const sub = await this.subCategoryRepo.findById(subCategoryId);
      if (!sub) {
        throw new EntityNotFoundError('Sub-category not found', 'SubCategory', subCategoryId);
      }
      if (categoryId && sub.categoryId !== categoryId) {
        throw new ValidationError('Sub-category does not belong to the given category');
      }
      return { categoryId: categoryId ?? sub.categoryId, subCategoryId };
    }

    if (categoryId) {
      const cat = await this.categoryRepo.findById(categoryId);
      if (!cat) {
        throw new EntityNotFoundError('Category not found', 'Category', categoryId);
      }
      return { categoryId, subCategoryId: undefined };
    }

    return {};
  }
}
