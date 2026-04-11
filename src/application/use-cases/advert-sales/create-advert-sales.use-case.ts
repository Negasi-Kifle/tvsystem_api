import { AdvertSalesEntity } from '../../../domain/entities/adver-sales.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../domain/enums/advert-type.enum';
import { SalesCommissionType } from '../../../domain/enums/sales-commission-type.enum';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';
import { IUserRepository } from '../../../domain/repositories/user.repo';

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
    salesAgentId: string;
    industry?: string;
    festiveSeason?: string;
    referralSource?: string;
    advertAgency?: string;
    notes?: string;
};

export class CreateAdvertSalesUseCase {
    constructor(
        private readonly advertSalesRepo: IAdvertSalesRepository,
        private readonly advertPackageRepo: IAdvertPackageRepository,
        private readonly customerRepo: ICustomerRepository,
        private readonly generateBusinessRefService: IGenerateBusinessRefService,
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(input: CreateAdvertSalesInput): Promise<AdvertSalesEntity> {
        const advertPackage = await this.advertPackageRepo.findById(input.adPackageId);
        if (!advertPackage) {
            throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', input.adPackageId);
        }

        const customer = await this.customerRepo.findById(input.customerId);
        if (!customer) {
            throw new EntityNotFoundError('Customer not found', 'Customer', input.customerId);
        }

        const referenceNumber = await this.generateBusinessRefService.generateBusinessRef();
        const finalPrice =
            Math.round(advertPackage.finalPrice * (1 - input.discountPercentage / 100) * 100) / 100;

        const user = await this.userRepository.findById(input.salesAgentId);
        if (!user) {
            throw new EntityNotFoundError(
                'Sales agent user not found',
                'User',
                input.salesAgentId,
            );
        }

        if (user.salesCommissionType === undefined || user.salesCommissionAmount === undefined) {
            throw new ValidationError('Your account has not been assigned a sales commission type and amount. Please contact the administrator.');
        }


         const agentCommissionPercentage = computeStoredAgentCommissionPercentage(
                user.salesCommissionType,
                user.salesCommissionAmount,
            finalPrice,
        );

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
            input.campaignName,
            input.contractSignDate,
            referenceNumber,
            user?.id,
            agentCommissionPercentage,
            input.industry,
            input.festiveSeason,
            input.referralSource,
            input.advertAgency,
            input.notes,
        );
        return this.advertSalesRepo.create(entity);
    }
}

function computeStoredAgentCommissionPercentage(
    type: SalesCommissionType | undefined,
    amount: number | undefined,
    finalPrice: number,
): number {
    const rawAmount = amount ?? 0;

    if (type === undefined) {
        return 0;
    }

    if (type === SalesCommissionType.Percentage) {
        return rawAmount;
    }

    if (type === SalesCommissionType.Fixed) {
        if (finalPrice <= 0) {
            throw new ValidationError('Final price must be positive to compute fixed sales commission');
        }
        const pct = (rawAmount / finalPrice) * 100;
        if (pct > 100) {
            throw new ValidationError('Fixed commission exceeds 100% of the final price');
        }
        return pct;
    }

    return 0;
}
