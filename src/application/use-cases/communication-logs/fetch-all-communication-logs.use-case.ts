import { ICommunicationLogRepository } from "../../../domain/repositories/communication-log.repository.interface";
import { CommunicationLogEntity } from "../../../domain/entities/communication-log.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class FetchAllCommunicationLogsUseCase{
    constructor(private readonly communicationLogRepo: ICommunicationLogRepository) { }

    async execute(query: QueryOptions<CommunicationLogEntity>): Promise<CommunicationLogEntity[]> {
        return this.communicationLogRepo.findMany(query);
    }
}