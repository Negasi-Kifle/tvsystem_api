import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { EntityNotFoundError } from "../../../domain/errors";

export class GetEmployeeByIdUseCase { 
    constructor(private readonly employeeRepository: IEmployeeRepository) { }

    async execute(id: string): Promise<EmployeeEntity | null> {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) {
            throw new EntityNotFoundError('Employee not found', 'Employee', id);
        }
        return employee;
    }
}