import { Show } from "@prisma/client";
import { ShowEntity } from "../../../domain/entities/show.entity";
import { ShowType } from "../../../domain/enums/show-type.enum";
import { Status } from "../../../domain/enums/status";

export function modelToEntity(show: Show): ShowEntity {
    return ShowEntity.createInstance(
        show.title,
        show.titleSlug,
        show.type as ShowType,
        show.durationMinutes,
        show.maxAdLengthMinutes,
        show.hostId ?? '',
        show.partsCount,
        show.rerunsCount,
        show.bonusCount,
        show.status as Status,
        show.createdAt,
        show.updatedAt,
        show.id,
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
        hostId: show.hostId,
        totalDurationMinutes: show.totalDurationMinutes,
        partsCount: show.partsCount,
        rerunsCount: show.rerunsCount,
        bonusCount: show.bonusCount,
        status: show.status,
        createdAt: show.createdAt ?? new Date(),
        updatedAt: show.updatedAt ?? new Date(),
    };
}