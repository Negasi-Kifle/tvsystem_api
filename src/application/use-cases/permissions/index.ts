import { CreatePermissionUseCase } from "./create.use-case";
import { GetPermissionByIdUseCase } from "./get-by-id.use-case";
import { FetchAllPermissionsUseCase } from "./fetch-all.use-case";
import { CountPermissionsUseCase } from "./count.use-case";
import { UpdatePermissionUseCase } from "./update.use-case";
import { DeletePermissionUseCase } from "./delete.use-case";

export class PermissionsUseCases {
    constructor(
        public readonly createPermissionUseCase = new CreatePermissionUseCase(),
        public readonly getPermissionByIdUseCase = new GetPermissionByIdUseCase(),
        public readonly fetchAllPermissionsUseCase = new FetchAllPermissionsUseCase(),
        public readonly countPermissionsUseCase = new CountPermissionsUseCase(),
        public readonly updatePermissionUseCase = new UpdatePermissionUseCase(),
        public readonly deletePermissionUseCase = new DeletePermissionUseCase()
    ) { }
}