import { QueryOptions } from "../../domain/interfaces/query-options.interface";
import { FetchAllCommunicationLogsDto } from "../dtos/requests/communication-log/fetch-all-comm-logs.dto";
import { CommunicationLogEntity } from "../../domain/entities/communication-log.entity";

export function mapFetchAllCommunicationLogsDtoToQueryOptions(dto: FetchAllCommunicationLogsDto): QueryOptions<CommunicationLogEntity> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    return {
        skip: (page - 1) * limit,
        take: limit,
        filters: {
            ...(dto.customerId != null && { customerId: dto.customerId }),
            ...(dto.mediaPackId != null && { mediaPackId: dto.mediaPackId }),
            ...(dto.salesAgentId != null && { salesAgentId: dto.salesAgentId }),
        }
    };
}