import { UserEntity } from "./user.entity";

export class EmployeeEntity {
  constructor(    
    public employeeNumber?: string,
    public department?: string,
    public isActive: boolean = true,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public user?: UserEntity,
  ) { }

  public static createInstance(
    employeeNumber?: string,
    department?: string,
    isActive?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    user?: UserEntity,
  ): EmployeeEntity {
    return new EmployeeEntity(
      employeeNumber,
      department,
      isActive,
      createdAt,
      updatedAt,
      id,
      user,
    );
  }


public updateInstance(employeeNumber?: string, department?: string, isActive?: boolean): EmployeeEntity {
  if (employeeNumber !== undefined) this.employeeNumber = employeeNumber;
  if (department !== undefined) this.department = department;
  if (isActive !== undefined) this.isActive = isActive;
  this.updatedAt = new Date();
  return this;
}

}
