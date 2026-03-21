import { Show, ShowHost } from '../generated/client';
import { ShowEntity } from "../../../domain/entities/show.entity";
import { ShowType } from "../../../domain/enums/show-type.enum";
import { Status } from "../../../domain/enums/status";
import { modelToEntity as mapShowHostToEntity } from "./show-host";

export type ShowWithRelations = Show & {
    showHosts?: ShowHost[] | null;
};

export function modelToEntity(show: ShowWithRelations): ShowEntity {
    return ShowEntity.createInstance(
        show.title,
        show.titleSlug,
        show.type as ShowType,
        show.durationMinutes,
        show.maxAdLengthMinutes,
        show.partsCount,
        show.rerunsCount,
        show.bonusCount,
        show.colorForScheduleBlock ?? undefined,
        show.status as Status,
        show.createdAt,
        show.updatedAt,
        show.id,
        show.showHosts ? show.showHosts.map(mapShowHostToEntity) : undefined,
    );
}

export function entityToModel(show: ShowEntity): Show {
    return {
        id: show.id ?? '',
        title: show.title,
        titleSlug: show.titleSlug,
        type: show.type as ShowType,
        durationMinutes: show.durationMinutes,
        maxAdLengthMinutes: show.maxAdLengthMinutes,
        totalDurationMinutes: show.totalDurationMinutes,
        partsCount: show.partsCount,
        rerunsCount: show.rerunsCount,
        bonusCount: show.bonusCount,
        colorForScheduleBlock: show.colorForScheduleBlock ?? null,
        status: show.status,
        createdAt: show.createdAt ?? new Date(),
        updatedAt: show.updatedAt ?? new Date(),
    };
}