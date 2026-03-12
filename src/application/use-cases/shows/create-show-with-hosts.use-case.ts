import { ShowHostEntity } from "../../../domain/entities/show-host.entity";
import { ShowEntity } from "../../../domain/entities/show.entity";
import { RevenueShareType } from "../../../domain/enums";
import { ShowType } from "../../../domain/enums/show-type.enum";
import { Status } from "../../../domain/enums/status";
import { EntityAlreadyExistsError, EntityNotFoundError, ValidationError } from "../../../domain/errors";
import { IShowRepository } from "../../../domain/repositories/show.repository.interface";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserFilters } from "../../../domain/interfaces/user-filters.interface";
import { IShowHostRepository } from "../../../domain/repositories/show-host.repository.interface";


export type CreateShowWithHostsInput = {
  title: string;
  titleSlug?: string;
  type: ShowType;
  durationMinutes: number;
  maxAdLengthMinutes: number;
  partsCount: number;
  rerunsCount: number;
  bonusCount: number;
  status?: Status;
  hosts?: {
    userId: string;
    revenueShareType?: RevenueShareType;
    revenueShareValue?: number;
    isPrimary?: boolean;
  }[];
}

export class CreateShowWithHostsUseCase {
  constructor(
    private readonly showRepository: IShowRepository,
    private readonly userRepository: IUserRepository,
    private readonly showHostRepository: IShowHostRepository,
  ) { }

  async execute(showWithHosts: CreateShowWithHostsInput): Promise<{ show: ShowEntity, hosts: ShowHostEntity[] }> {
    let savedShow: ShowEntity | undefined = undefined;
    try {

      // Check for duplicate title slug
      const titleSlug = showWithHosts.titleSlug ?? showWithHosts.title.toLowerCase().replace(/ /g, '-');
      const duplicateShow = await this.showRepository.findByTitleSlug(titleSlug);
      if (duplicateShow) {
        throw new EntityAlreadyExistsError('Show with this title slug already exists', 'Show');
      }

      // Check all hosts exist (id as array for id IN (...) query)
      if (showWithHosts.hosts && showWithHosts.hosts.length > 0) {
        const userIds = showWithHosts.hosts.map((host) => host.userId);
        const hosts = await this.userRepository.findMany({
          filters: { id: userIds } as UserFilters,
          take: userIds.length,
        });
        if (hosts.length !== showWithHosts.hosts.length) {
          throw new EntityNotFoundError('Some hosts not found', 'ShowHost', showWithHosts.hosts.map(host => host.userId).join(','));
        }
  
        // Check there's only one primary host
        const primaryHost = showWithHosts.hosts.filter(host => host.isPrimary === true);
        if (primaryHost.length > 1) {
          throw new ValidationError('There must be only one primary host');
        }
      }


      const showEntity = ShowEntity.createInstance(
        showWithHosts.title,
        titleSlug,
        showWithHosts.type,
        showWithHosts.durationMinutes,
        showWithHosts.maxAdLengthMinutes,
        showWithHosts.partsCount,
        showWithHosts.rerunsCount,
        showWithHosts.bonusCount,
        showWithHosts.status
      );

      // Create the show
      savedShow = await this.showRepository.create(showEntity);
      let savedShowHosts: ShowHostEntity[] = [];
      
      // Serious Note: don't forget to assign the show id in the DB transaction in the infra layer
      if (showWithHosts.hosts && showWithHosts.hosts.length > 0) { 
        const showHostsEntities = showWithHosts.hosts.map(
          host => ShowHostEntity.createInstance(
            host.userId, savedShow!.id!, host.revenueShareType, host.revenueShareValue, host.isPrimary ?? false));
            savedShowHosts = await this.showHostRepository.createMany(showHostsEntities);
      }

      return { show: savedShow, hosts: savedShowHosts };
    } catch (error) {
      // Delete the show if it was created. Deleting the show will cascade delete the show hosts.
      if (savedShow) {
        await this.showRepository.deleteById(savedShow.id!);
      }

      throw error
    }
  }
}   