import { CommunicationLogEntity } from "../../../domain/entities/communication-log.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { ICommunicationLogRepository } from "../../../domain/repositories/communication-log.repository.interface";


export class CountAllCommunicationLogsUseCase{
    constructor(private readonly communicationLogRepo: ICommunicationLogRepository) { }

    async execute(query: QueryOptions<CommunicationLogEntity>): Promise<number> {
        return this.communicationLogRepo.count(query.filters ?? {});
    }
}