import { ValidationError } from '../errors/validation.error';
import { AdvertSalesStatus } from '../enums/advert-sales.enum';
import { AdvertType } from '../enums/advert-type.enum';
import { AdvertPackageEntity } from './advert-package.entity';
import { CustomerEntity } from './customer.entity';

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
        public campaignName: string,
        public contractSignDate: Date,
        public salesAgentId?: string | null,
        public agentCommissionPercentage: number = 0,
        public industry?: string | null,
        public festiveSeason?: string | null,
        public referralSource?: string | null,
        public advertAgency?: string | null,
        public notes?: string | null,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public adPackage?: AdvertPackageEntity,
        public customer?: CustomerEntity,
    ) { }

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
        campaignName: string,
        contractSignDate: Date,
        referenceNumber: string,
        salesAgentId?: string | null,
        agentCommissionPercentage: number = 0,
        industry?: string | null,
        festiveSeason?: string | null,
        referralSource?: string | null,
        advertAgency?: string | null,
        notes?: string | null,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
        adPackage?: AdvertPackageEntity,
        customer?: CustomerEntity,
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
        if (agentCommissionPercentage < 0 || agentCommissionPercentage > 100) {
            throw new ValidationError('Agent commission percentage must be between 0 and 100');
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
            campaignName,
            contractSignDate,
            salesAgentId,
            agentCommissionPercentage,
            industry,
            festiveSeason,
            referralSource,
            advertAgency,
            notes,
            createdAt,
            updatedAt,
            id,
            adPackage,
            customer,
        );
    }
}
