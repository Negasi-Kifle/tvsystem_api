import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserEntity } from "../../../domain/entities/user.entity";

export type UpdateEmployeeInput = {
    employeeNumber?: string;
    department?: string;
}


export class UpdateEmployeeUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository) { }

    async execute(id: string, payload: UpdateEmployeeInput): Promise<EmployeeEntity | null> {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) {
            throw new EntityNotFoundError('Employee not found', 'Employee', id);
        }

        const updatedEmployee = employee.updateInstance(
            payload.employeeNumber ?? employee.employeeNumber,
            payload.department ?? employee.department,
        );

        return await this.employeeRepository.update(updatedEmployee);
    }
}