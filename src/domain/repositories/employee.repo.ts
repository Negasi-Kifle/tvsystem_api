import { EmployeeEntity } from '../entities/employee.entity';
import { IBaseRepository } from './base.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { QueryOptions } from '../interfaces/query-options.interface';

export interface IEmployeeRepository extends IBaseRepository<EmployeeEntity> {
    createEmployeeAndUser(
        employee: Omit<EmployeeEntity, 'id'>,
        user: Omit<UserEntity, 'id'>): Promise<{ employee: EmployeeEntity, user: UserEntity }>;

    createEmployeeUserAndPermissions(
        employee: Omit<EmployeeEntity, 'id'>,
        user: Omit<UserEntity, 'id'>,
        permissionIds: string[],
        grantedBy?: string,
    ): Promise<{ employee: EmployeeEntity, user: UserEntity }>;


    updateEmployeeAndUserStatus(
        employee: EmployeeEntity,
        user: UserEntity,
    ): Promise<{ employee: EmployeeEntity, user: UserEntity }>;

    findManyWithoutUser(query: QueryOptions<EmployeeEntity>): Promise<EmployeeEntity[]>;
    countWithoutUser(filters?: Partial<EmployeeEntity>): Promise<number>;
}
