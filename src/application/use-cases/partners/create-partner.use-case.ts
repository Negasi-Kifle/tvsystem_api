import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { SexTypes, UserRole } from "../../../domain/enums";
import { ValidationError } from "../../../domain/errors/validation.error";
import { IPartnerRepository,  } from "../../../domain/repositories/partner.repo";
import { Percentage } from "../../../domain/value-objects/percentage.value-object";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";


export type CreatePartnerInput = {
    fullName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    sex: SexTypes;
    revenueShare: Percentage;
    roles?: UserRole[];
    isActive?: boolean;
    isFirstTimeAccount?: boolean;
    telegramUsername?: string;
    permissionIds?: string[];
    grantedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}   

export class CreatePartnerAndUserUseCase {
    constructor(
        private readonly partnerRepo: IPartnerRepository,
        private readonly permissionRepository: IPermissionRepository,
        private readonly userRepository: IUserRepository,
    ) { }


    private async validatePermissionsExist(permissionIds: string[]): Promise<void> {
        if (permissionIds.length === 0) return;

        const permissionEntities = await Promise.all(
            permissionIds.map((permissionId) => this.permissionRepository.findById(permissionId))
        );

        const missingPermissionIds = permissionIds.filter((_, index) => !permissionEntities[index]);
        if (missingPermissionIds.length > 0) {
            throw new ValidationError(
                `The following permissions do not exist: ${missingPermissionIds.join(", ")}`
            );
        }
    }

    
    async execute(payload: CreatePartnerInput): Promise<{ partner: PartnerEntity, user: UserEntity }> {
        // Check if permissions exist
        const permissionIds = [...new Set(payload.permissionIds ?? [])];
        await this.validatePermissionsExist(permissionIds);

        // Check email and phone number are not taken in user
        const [existingUserByEmail, existingUserByPhoneNumber] = await Promise.all([
            this.userRepository.findByEmailOrPhoneNumber(payload.email),
            this.userRepository.findByEmailOrPhoneNumber(payload.phoneNumber),
        ]);

        if (existingUserByEmail || existingUserByPhoneNumber) {
            const errorMessage = existingUserByEmail ? 'Email already taken' : 'Phone number already taken';
            throw new ValidationError(errorMessage);
        }

        const partnerEntity = PartnerEntity.createInstance(
            payload.revenueShare,
            payload.isActive ?? true,
        );


        const userEntity = UserEntity.createInstance(
            payload.fullName,
            payload.email,
            payload.passwordHash,
            payload.phoneNumber,
            payload.sex,
            payload.roles ?? [UserRole.Partner],
            payload.isActive ?? true,
            payload.isFirstTimeAccount ?? false,
            undefined, // refModel is set to "Partner" in the repository implementation (infra layer)
            payload.telegramUsername,
        );

        return this.partnerRepo.createPartnerAndUser(
            partnerEntity, 
            userEntity, 
            permissionIds, 
            payload.grantedBy,
        );
    }
}