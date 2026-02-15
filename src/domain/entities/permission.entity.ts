export class PermissionEntity {
    constructor(
        public name: string,
        public nameSlug: string,
        public description?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public isSystemPermission?: boolean
    ) { }

    public static createInstance(
        name: string,
        nameSlug: string,
        isSystemPermission?: boolean,
        description?: string,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
    ): PermissionEntity {
        if (name === undefined || !name) throw new Error('Name is required');

        if (nameSlug === undefined || !nameSlug) throw new Error('Name slug is required');

        if (isSystemPermission === undefined || !isSystemPermission) isSystemPermission = false;

        createdAt = createdAt ?? new Date();
        updatedAt = updatedAt ?? new Date();
        return new PermissionEntity(name, nameSlug, description, createdAt, updatedAt, id, isSystemPermission);
    }


    public updateInstance(name?: string, nameSlug?: string, description?: string, isSystemPermission?: boolean): PermissionEntity {
        if (name !== undefined) this.name = name;
        if (nameSlug !== undefined) this.nameSlug = nameSlug;
        if (description !== undefined) this.description = description;
        if (isSystemPermission !== undefined) this.isSystemPermission = isSystemPermission;

        this.updatedAt = new Date();
        return this;
    }
}