import { PrismaBaseRepository } from "./base.repository";
import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { modelToEntity, entityToModel } from "../model_entity_mappers/employee";
import { buildWhereClauseForEmployee } from "../where_clauses/employee";
import { UserEntity } from "../../../domain/entities/user.entity";
import { entityToModel as userEntityToModel, modelToEntity as userModelToEntity } from "../model_entity_mappers/user";
import { UserRefModel } from "../../../domain/enums/user-ref-model.enum";
import { ValidationError } from "../../../domain/errors";
import { hashPassword } from "../../../shared/utils/password";

export class EmployeeRepository extends PrismaBaseRepository implements IEmployeeRepository {

  async createEmployeeAndUser(employee: Omit<EmployeeEntity, 'id'>, user: Omit<UserEntity, 'id'>): Promise<{ employee: EmployeeEntity, user: UserEntity }> {
    return this.createEmployeeUserAndPermissions(employee, user, []);
  }

  async createEmployeeUserAndPermissions(
    employee: Omit<EmployeeEntity, 'id'>,
    user: Omit<UserEntity, 'id'>,
    permissionIds: string[],
    grantedBy?: string,
  ): Promise<{ employee: EmployeeEntity, user: UserEntity }> {
    const empModel = entityToModel(employee);
    const userModel = userEntityToModel(user);

    const { id: _omitEmp, ...empData } = empModel;
    const { id: _omitUser, ...userData } = userModel;

    return this.prisma.$transaction(async (tx) => {
      const uniquePermissionIds = [...new Set(permissionIds)];

      const savedEmployee = await tx.employee.create({ data: empData });
      // Add refModel and employee id to user
      userData.refModel = UserRefModel.Employee;
      userData.employeeId = savedEmployee.id;
      userData.passwordHash = await hashPassword(userData.passwordHash);
      const savedUser = await tx.user.create({ data: userData });

      if (uniquePermissionIds.length > 0) {
        const effectiveGrantedBy = grantedBy ?? savedUser.id;
        await tx.userPermission.createMany({
          data: uniquePermissionIds.map((permissionId) => ({
            userId: savedUser.id,
            permissionId,
            grantedBy: effectiveGrantedBy,
          })),
        });
      }

      return { employee: modelToEntity(savedEmployee), user: userModelToEntity(savedUser) };
    });
  }

  async create(data: Omit<EmployeeEntity, 'id'>): Promise<EmployeeEntity> {
    const createData = {
      employeeNumber: data.employeeNumber ?? null,
      department: data.department ?? null,
      isActive: data.isActive ?? true,
    };
    const saved = await this.prisma.employee.create({ data: createData });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<EmployeeEntity | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { user: true },
    });
    return employee ? modelToEntity(employee) : null;
  }

  async findMany(query: QueryOptions<EmployeeEntity>): Promise<EmployeeEntity[]> {
    const where = buildWhereClauseForEmployee(query.filters ?? {});
    const list = await this.prisma.employee.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { user: true },
    });
    return list.map(modelToEntity);
  }

  async findManyWithoutUser(query: QueryOptions<EmployeeEntity>): Promise<EmployeeEntity[]> {
    const where = buildWhereClauseForEmployee(query.filters ?? {});
    const list = await this.prisma.employee.findMany({
      where: {
        ...where,
        user: null,
      },
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { user: true },
    });
    return list.map(modelToEntity);
  }

  async update(entity: EmployeeEntity): Promise<EmployeeEntity | null> {
    const updated = await this.prisma.employee.update({
      where: { id: entity.id },
      data: entityToModel(entity),
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<EmployeeEntity | null> {
    const deleted = await this.prisma.employee.delete({ where: { id } });
    return modelToEntity(deleted);
  }

  async count(filters?: Partial<EmployeeEntity>): Promise<number> {
    const where = buildWhereClauseForEmployee(filters ?? {});
    return this.prisma.employee.count({ where });
  }

  async countWithoutUser(filters?: Partial<EmployeeEntity>): Promise<number> {
    const where = buildWhereClauseForEmployee(filters ?? {});
    return this.prisma.employee.count({
      where: {
        ...where,
        user: null,
      },
    });
  }

  async updateEmployeeAndUserStatus(employee: EmployeeEntity, user: UserEntity): Promise<{ employee: EmployeeEntity, user: UserEntity }> {
    return this.prisma.$transaction(async (tx) => {
      const updatedEmployee = await tx.employee.update({ where: { id: employee.id }, data: entityToModel(employee) });
      const updatedUser = await tx.user.update({ where: { id: user.id }, data: userEntityToModel(user) });
      return { employee: modelToEntity(updatedEmployee), user: userModelToEntity(updatedUser) };
    });
  }
}
