import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { EntityAlreadyExistsError } from '../../../domain/errors';
import { ICalendarService } from '../../../domain/services/calendar.service';
import { IScheduleActivationHandler } from '../../../domain/services/schedule-activation.handler';

export type UpdateSatelliteSchedulePayload = {
  name?: string;
  nameSlug?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  status?: SatelliteScheduleStatus;
  scheduleType?: SatelliteScheduleType;
  effectiveFromEth?: Date;
  effectiveToEth?: Date;
};

export class UpdateSatelliteScheduleUseCase {
  constructor(
    private readonly scheduleRepo: ISatelliteScheduleRepository,
    private readonly calendarService: ICalendarService,
    private readonly activationHandler?: IScheduleActivationHandler,
  ) {}

  async execute(
    id: string,
    payload: UpdateSatelliteSchedulePayload,
  ): Promise<SatelliteScheduleEntity | null> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', id);
    }

    const previousStatus = schedule.status;

    if (payload.nameSlug != null && payload.nameSlug !== schedule.nameSlug) {
      const duplicate = await this.scheduleRepo.findByNameSlug(payload.nameSlug);
      if (duplicate && duplicate.id !== id) {
        throw new EntityAlreadyExistsError(
          'Satellite schedule with this name slug already exists',
          'SatelliteSchedule',
          payload.nameSlug,
        );
      }
    }
    if(payload.status === SatelliteScheduleStatus.Active) {
    const active = await this.scheduleRepo.findMany({ filters: { status: SatelliteScheduleStatus.Active, scheduleType: schedule.scheduleType }, take: 1 });
      if(active.length > 0 && active[0]?.id !== id) {
        throw new ValidationError('There is already an active satellite schedule');
      }
    }

    const effFromConverter = this.calendarService.convertToEthiopian(payload.effectiveFrom ?? schedule.effectiveFrom);
    const effToConverter = this.calendarService.convertToEthiopian(payload.effectiveTo ?? schedule.effectiveTo);

    const updated = schedule.updateInstance(
      payload.name,
      payload.nameSlug,
      payload.effectiveFrom,
      payload.effectiveTo,
      payload.status,
      payload.scheduleType,
      effFromConverter,
      effToConverter,
    );

    const result = await this.scheduleRepo.update(updated);

    const activating =
      previousStatus !== SatelliteScheduleStatus.Active &&
      payload.status === SatelliteScheduleStatus.Active;

    if (activating && this.activationHandler && result) {
      await this.activationHandler.onScheduleActivated(id);
    }

    return result;
  }
}
