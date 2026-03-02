import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repo";



export class UpdateEmployeeStatusUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository, private readonly userRepository: IUserRepository) { }

    async execute(id: string, isActive: boolean): Promise<{ employee: EmployeeEntity, user: UserEntity }> {
        const employee = await this.employeeRepository.findById(id);
        if (!employee) {
            throw new EntityNotFoundError('Employee not found', 'Employee', id);
        }

        const user = await this.userRepository.findMany({ filters: { employeeId: id } });
        if (!user || user.length === 0) {
            throw new EntityNotFoundError('User not found', 'User', id);
        }
        let updatedUser = user[0];
        const updatedEmployee = employee.updateInstance(undefined, undefined, isActive);
        if (updatedUser) {
            updatedUser = updatedUser.updateInstance(undefined, undefined, undefined, undefined, undefined, undefined, isActive);
        }

        return await this.employeeRepository.updateEmployeeAndUserStatus(updatedEmployee, updatedUser as UserEntity);
    }
}