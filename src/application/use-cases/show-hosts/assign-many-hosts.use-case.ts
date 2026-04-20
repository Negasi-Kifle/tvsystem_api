import { ShowHostEntity } from "../../../domain/entities/show-host.entity";
import { RevenueShareType } from "../../../domain/enums";
import { EntityAlreadyExistsError, EntityNotFoundError, ValidationError } from "../../../domain/errors";
import { IShowHostRepository } from "../../../domain/repositories/show-host.repository.interface";
import { IShowRepository } from "../../../domain/repositories/show.repository.interface";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserFilters } from "../../../domain/interfaces/user-filters.interface";

export type AssignManyHostsToShowInput = {
  showId: string;
  hosts: {
    userId: string;
    revenueShareType?: RevenueShareType;
    revenueShareValue?: number;
    isPrimary?: boolean;
  }[];
};

export class AssignManyHostsToShowUseCase {
  constructor(
    private readonly showHostRepo: IShowHostRepository,
    private readonly showRepo: IShowRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(input: AssignManyHostsToShowInput): Promise<ShowHostEntity[]> {
    const show = await this.showRepo.findById(input.showId);
    if (!show) {
      throw new EntityNotFoundError("Show not found", "Show", input.showId);
    }

    const userIds = input.hosts.map((host) => host.userId);
    const users = await this.userRepo.findMany({
      filters: { id: userIds } as UserFilters,
      take: userIds.length,
    });

    if (users.length !== input.hosts.length) {
      throw new EntityNotFoundError(
        "Some hosts not found",
        "ShowHost",
        userIds.join(","),
      );
    }

    const uniqueUserIds = new Set<string>();
    for (const host of input.hosts) {
      if (uniqueUserIds.has(host.userId)) {
        throw new ValidationError("Duplicate hosts in request");
      }
      uniqueUserIds.add(host.userId);
    }

    const existingHosts = await this.showHostRepo.findByShow(input.showId);
    const existingByUserId = new Map(
      existingHosts.map((host) => [host.userId, host]),
    );

    const hostsToCreate: AssignManyHostsToShowInput["hosts"] = [];
    const hostsToUpdate: {
      payload: AssignManyHostsToShowInput["hosts"][number];
      existing: ShowHostEntity;
    }[] = [];

    for (const host of input.hosts) {
      const existing = existingByUserId.get(host.userId);
      if (existing) {
        hostsToUpdate.push({ payload: host, existing });
      } else {
        hostsToCreate.push(host);
      }
    }

    const existingPrimaryCount = existingHosts.filter((host) => host.isPrimary)
      .length;
    const requestedPrimaryCount = input.hosts.filter(
      (host) => host.isPrimary === true,
    ).length;
    const newHostsRequestingPrimary = hostsToCreate.filter(
      (host) => host.isPrimary === true,
    ).length;

    if (existingPrimaryCount > 0 && newHostsRequestingPrimary > 0) {
      throw new EntityAlreadyExistsError(
        "Only one primary host per show is allowed",
        "ShowHost",
        input.showId,
      );
    }

    if (existingPrimaryCount === 0 && requestedPrimaryCount > 1) {
      throw new ValidationError("There must be only one primary host");
    }

    for (const { payload, existing } of hostsToUpdate) {
      const willBePrimary =
        payload.isPrimary !== undefined
          ? payload.isPrimary
          : existing.isPrimary;
      if (willBePrimary) {
        const otherPrimary = existingHosts.find(
          (h) => h.isPrimary && h.id !== existing.id,
        );
        if (otherPrimary) {
          throw new EntityAlreadyExistsError(
            "Only one primary host per show is allowed",
            "ShowHost",
            `${input.showId}:${payload.userId}`,
          );
        }
      }
    }

    const updated = await Promise.all(
      hostsToUpdate.map(async ({ payload, existing }) => {
        const entity = ShowHostEntity.createInstance(
          existing.userId,
          existing.showId,
          payload.revenueShareType ?? existing.revenueShareType,
          payload.revenueShareValue ?? existing.revenueShareValue,
          payload.isPrimary ?? existing.isPrimary,
          existing.createdAt,
          new Date(),
          existing.id,
        );
        const saved = await this.showHostRepo.update(entity);
        if (!saved) {
          throw new EntityNotFoundError(
            "Show host assignment not found",
            "ShowHost",
            existing.id ?? payload.userId,
          );
        }
        return saved;
      }),
    );

    const created =
      hostsToCreate.length > 0
        ? await this.showHostRepo.createMany(
            hostsToCreate.map((host) =>
              ShowHostEntity.createInstance(
                host.userId,
                input.showId,
                host.revenueShareType,
                host.revenueShareValue,
                host.isPrimary ?? false,
              ),
            ),
          )
        : [];

    const resultByUserId = new Map<string, ShowHostEntity>(
      updated.map((row) => [row.userId, row]),
    );
    for (const row of created) {
      resultByUserId.set(row.userId, row);
    }

    return input.hosts.map((host) => resultByUserId.get(host.userId)!);
  }
}