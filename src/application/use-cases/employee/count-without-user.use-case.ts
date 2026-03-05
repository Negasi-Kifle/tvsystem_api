import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";

export class CountEmployeesWithoutUserUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository) { }

    async execute(filters?: Partial<EmployeeEntity>): Promise<number> {
        return this.employeeRepository.countWithoutUser(filters);
    }
}
