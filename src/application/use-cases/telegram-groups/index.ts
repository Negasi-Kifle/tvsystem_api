import { CountTgGroupsUseCase } from "./count-tg-groups.use-case";
import { CreateTgGroupUseCase } from "./create-tg-group.use-case";
import { DeleteTgGroupUseCase } from "./delete-tg-group.use-case";
import { FetchAllTgGroupsUseCase } from "./fetch-all-tg-groups.use-case";
import { GetTgGroupByIdUseCase } from "./get-by-id.use-case";
import { UpdateTgGroupUseCase } from "./update-tg-group.use-case";

export class TelegramGroupsUseCases {
    constructor(
        public readonly createTgGroupUseCase = new CreateTgGroupUseCase(),
        public readonly updateTgGroupUseCase = new UpdateTgGroupUseCase(),
        public readonly getTgGroupByIdUseCase = new GetTgGroupByIdUseCase(),
        public readonly fetchAllTgGroupsUseCase = new FetchAllTgGroupsUseCase(),
        public readonly deleteTgGroupUseCase = new DeleteTgGroupUseCase(),
        public readonly countTgGroupsUseCase = new CountTgGroupsUseCase()
    ) { }
}