import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { SexTypes, UserRole } from "../../../domain/enums";
import { SalesCommissionType } from "../../../domain/enums/sales-commission-type.enum";
import { ValidationError } from "../../../domain/errors";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";

export type CreateEmployeeInput = {
    fullName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    sex: SexTypes;
    roles: UserRole[];
    isActive?: boolean;
    isFirstTimeAccount?: boolean;
    telegramUsername?: string;
    employeeNumber?: string;
    department?: string;
    salesCommissionType?: SalesCommissionType;
    salesCommissionAmount?: number;
    permissionIds?: string[];
    grantedBy?: string;
}

export class CreateEmployeeAndUserUseCase {
    constructor(
        private readonly employeeRepository: IEmployeeRepository,
        private readonly userRepository: IUserRepository,
        private readonly permissionRepository: IPermissionRepository,
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

    async execute(payload: CreateEmployeeInput): Promise<{ employee: EmployeeEntity, user: UserEntity }> {
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

        const employeeEntity = EmployeeEntity.createInstance(
            payload.employeeNumber,
            payload.department,
            payload.isActive ?? true,
        );
        
        const userEntity = UserEntity.createInstance(
            payload.fullName,
            payload.email,
            payload.passwordHash,
            payload.phoneNumber,
            payload.sex,
            payload.roles,
            payload.isActive ?? true,
            payload.isFirstTimeAccount ?? false,
            undefined, // refModel is set to "Employee" in the repository implementation (infra layer)
            payload.telegramUsername,
            undefined,
            undefined,
            payload.salesCommissionType,
            payload.salesCommissionAmount,
        );

        return this.employeeRepository.createEmployeeUserAndPermissions(
            employeeEntity,
            userEntity,
            permissionIds,
            payload.grantedBy,
        );
    }
}