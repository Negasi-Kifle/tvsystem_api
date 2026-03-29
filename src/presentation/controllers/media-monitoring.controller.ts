import { Request, Response, NextFunction } from 'express';
import { FetchUnlinkedMediaMonitoringUseCase } from '../../application/use-cases/media-monitoring/fetch-unlinked-media-monitoring.use-case';
import { CreateMediaMonitoringRecordUseCase } from '../../application/use-cases/media-monitoring/create-media-monitoring-record.use-case';
import { CreateMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/create-media-monitoring-record.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createMediaMonitoringHandlers(
  deps: Pick<ApiRouterDeps, 'mediaMonitoringRecordRepository'>,
) {
  const { mediaMonitoringRecordRepository } = deps;

  const fetchUnlinkedMediaMonitoringUseCase = new FetchUnlinkedMediaMonitoringUseCase(
    mediaMonitoringRecordRepository,
  );
  const createMediaMonitoringRecordUseCase = new CreateMediaMonitoringRecordUseCase(
    mediaMonitoringRecordRepository,
  );

  async function fetchUnlinkedMediaMonitoring(_req: Request, res: Response, next: NextFunction) {
    try {
      const records = await fetchUnlinkedMediaMonitoringUseCase.execute();

      res.status(200).json({
        status: 'SUCCESS',
        data: { records },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createMediaMonitoringRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateMediaMonitoringRecordDto;
      const record = await createMediaMonitoringRecordUseCase.execute({
        channel: payload.channel,
        sponsorName: payload.sponsorName,
        monitoringDate: payload.monitoringDate,
        showName: payload.showName,
        timeSlot: payload.timeSlot,
        statusWithUs: payload.statusWithUs,
        contactInfo: payload.contactInfo,
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Media monitoring record created successfully',
        data: { record },
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    fetchUnlinkedMediaMonitoring,
    createMediaMonitoringRecord,
  };
}
