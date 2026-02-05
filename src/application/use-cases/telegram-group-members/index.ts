import { AddMemberToTelegramGroupUseCase } from "./add-member-to-tg-group.use-case";
import { FetchAllTelegramGroupMembersUseCase } from "./fetch-all.use-case";
import { CountTgMembersUseCase } from "./count-tg-members.use-case";
import { FindByIdTgMemberUseCase } from "./find-by-id.use-case";
import { DeleteTgMemberByIdUseCase } from "./delete-tg-group-member.use-case";

export class TelegramGroupMembersUseCases {
    constructor(
        public readonly addMemberToTelegramGroupUseCase = new AddMemberToTelegramGroupUseCase(),
        public readonly fetchAllTelegramGroupMembersUseCase = new FetchAllTelegramGroupMembersUseCase(),
        public readonly countTelegramGroupMembersUseCase = new CountTgMembersUseCase(),
        public readonly findByIdTgMemberUseCase = new FindByIdTgMemberUseCase(),
        public readonly deleteTgMemberByIdUseCase = new DeleteTgMemberByIdUseCase()
    ) { }
}