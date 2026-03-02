import { IUserRepository } from '../../../domain/repositories/user.repo';
import { IPartnerRepository } from '../../../domain/repositories/partner.repo';
import { IEmployeeRepository } from '../../../domain/repositories/employee.repo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { SexTypes } from '../../../domain/enums/sex-types.enum';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';


export type UpdateUserInput = {
    fullName?: string;
    email?: string;
    passwordHash?: string;
    phoneNumber?: string;
    sex?: SexTypes;
    roles?: UserRole[];
    isActive?: boolean;
    isFirstTimeAccount?: boolean;
    telegramUsername?: string;
}


export class UpdateUserUseCase {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly partnerRepo: IPartnerRepository,
        private readonly employeeRepo: IEmployeeRepository,
    ) { }

    async execute(id: string, payload: UpdateUserInput): Promise<UserEntity | null> {
        const [user, firstTimeAccExists] = await Promise.all([
            this.userRepo.findById(id),
            this.userRepo.findMany({ filters: { isFirstTimeAccount: true, isActive: true } })
        ]);
        if (!user) {
            throw new EntityNotFoundError('User not found', 'User', id);
        }

        if (payload.isFirstTimeAccount && firstTimeAccExists.length > 0 && firstTimeAccExists[0]?.id !== id) {
            throw new ValidationError('First time account already exists');
        }

        if (user.isFirstTimeAccount && payload.isActive === false) {
            throw new ValidationError("First time account could not be deactivated");
        }

        const updatedUser = user.updateInstance(
            payload.fullName ?? user.fullName,
            payload.email ?? user.email,
            payload.passwordHash ?? user.passwordHash,
            payload.phoneNumber ?? user.phoneNumber,
            payload.sex ?? user.sex,
            payload.roles ?? user.roles,
            payload.isActive ?? user.isActive,
            payload.isFirstTimeAccount ?? user.isFirstTimeAccount,
            payload.telegramUsername ?? user.telegramUsername);

        const result = await this.userRepo.update(updatedUser);

        if (result && payload.isActive !== undefined && (user.partnerId || user.employeeId)) {
            if (user.partnerId) {
                const partner = await this.partnerRepo.findById(user.partnerId);
                if (partner) {
                    await this.partnerRepo.update({ ...partner, isActive: payload.isActive });
                }
            }
            if (user.employeeId) {
                const employee = await this.employeeRepo.findById(user.employeeId);
                if (employee) {
                    await this.employeeRepo.update(employee.updateInstance(undefined, undefined, payload.isActive));
                }
            }
        }

        return result;
    }
}