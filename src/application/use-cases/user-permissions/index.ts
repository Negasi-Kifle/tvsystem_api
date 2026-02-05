import { CountUserPermissionsUseCase } from "./count.use-case";
import { CreateUserPermissionUseCase } from "./create.use-case";
import { FetchAllUserPermissionsUseCase } from "./fetch-all.use-case";

export class UserPermissionsUseCases {
    constructor(
        public readonly createUserPermissionUseCase = new CreateUserPermissionUseCase(),
        public readonly fetchAllUserPermissionsUseCase = new FetchAllUserPermissionsUseCase(),
        public readonly countUserPermissionsUseCase = new CountUserPermissionsUseCase()
    ) {}
}