import { EmployeeEntity } from '../entities/employee.entity';
import { IBaseRepository } from './base.repository.interface';
import { UserEntity } from '../entities/user.entity';

export interface IEmployeeRepository extends IBaseRepository<EmployeeEntity> {
    createEmployeeAndUser(
        employee: Omit<EmployeeEntity, 'id'>,
        user: Omit<UserEntity, 'id'>): Promise<{ employee: EmployeeEntity, user: UserEntity }>;
    
    
    updateEmployeeAndUserStatus(
        employee: EmployeeEntity,
        user: UserEntity,
    ): Promise<{ employee: EmployeeEntity, user: UserEntity }>;
}
