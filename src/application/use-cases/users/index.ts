import { CreateUserUseCase } from "./create-user.use-case";
import { GetByIdUseCase } from "./get-by-id.use-case";
import { UpdateUserUseCase } from "./update-user.use-case";
import { FetchAllUsersUseCase } from "./fetch-all.use-case";
import { CountUsersUseCase } from "./count-users.use-case";
import { GetByEmailOrPhoneUseCase } from "./get-by-email-or-phone.use-case";
import { DeleteUserUseCase } from "./delete-user.uase-case";

export class UsersUseCases {
    constructor(
        public readonly createUserUseCase = new CreateUserUseCase(),
        public readonly getByIdUseCase = new GetByIdUseCase(),
        public readonly updateUserUseCase = new UpdateUserUseCase(),
        public readonly fetchAllUsersUseCase = new FetchAllUsersUseCase(),
        public readonly countUsersUseCase = new CountUsersUseCase(),
        public readonly getByEmailOrPhoneUseCase = new GetByEmailOrPhoneUseCase(),
        public readonly deleteUserUseCase = new DeleteUserUseCase()
    ) { }
}  