import { TelegramGroupMemberEntity } from "../entities/telegram-group-member.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface ITelegramGroupMembersRepository extends IBaseRepository<TelegramGroupMemberEntity> {
}