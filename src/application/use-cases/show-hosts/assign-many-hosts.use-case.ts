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

    const existingUserIds = new Set(existingHosts.map((host) => host.userId));
    const duplicateUserId = userIds.find((id) => existingUserIds.has(id));
    if (duplicateUserId) {
      throw new EntityAlreadyExistsError(
        "Some hosts already assigned to this show. Please remove them",
        "ShowHost",
        `${input.showId}:${duplicateUserId}`,
      );
    }

    const existingPrimaryCount = existingHosts.filter((host) => host.isPrimary)
      .length;
    const requestedPrimaryCount = input.hosts.filter(
      (host) => host.isPrimary === true,
    ).length;

    if (existingPrimaryCount > 0 && requestedPrimaryCount > 0) {
      throw new EntityAlreadyExistsError(
        "Only one primary host per show is allowed",
        "ShowHost",
        input.showId,
      );
    }

    if (existingPrimaryCount === 0 && requestedPrimaryCount > 1) {
      throw new ValidationError("There must be only one primary host");
    }

    const entities = input.hosts.map((host) =>
      ShowHostEntity.createInstance(
        host.userId,
        input.showId,
        host.revenueShareType,
        host.revenueShareValue,
        host.isPrimary ?? false,
      )
    );
      
    return this.showHostRepo.createMany(entities);
  }
}