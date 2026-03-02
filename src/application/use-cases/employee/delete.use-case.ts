import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";



export class DeleteEmployeeUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository, private readonly userRepository: IUserRepository) { }

    async execute(id: string): Promise<EmployeeEntity | null> {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) {
            throw new EntityNotFoundError('Employee not found', 'Employee', id);
        }

        return await this.employeeRepository.deleteById(id);
    }
}