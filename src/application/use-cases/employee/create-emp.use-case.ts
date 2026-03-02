import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { SexTypes, UserRefModel, UserRole } from "../../../domain/enums";
import { ValidationError } from "../../../domain/errors";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserEntity } from "../../../domain/entities/user.entity";

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
}

export class CreateEmployeeAndUserUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository, private readonly userRepository: IUserRepository) {
    }

    async execute(payload: CreateEmployeeInput): Promise<{ employee: EmployeeEntity, user: UserEntity }> {
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
        );
        
        return this.employeeRepository.createEmployeeAndUser(employeeEntity, userEntity);
    }
}