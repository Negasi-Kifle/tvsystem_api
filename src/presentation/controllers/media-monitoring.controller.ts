import { Request, Response, NextFunction } from 'express';
import { MediaMonitoringRecordRepository } from '../../infrastructure/prisma/repositories/media-monitoring-record.repository';
import { FetchUnlinkedMediaMonitoringUseCase } from '../../application/use-cases/media-monitoring/fetch-unlinked-media-monitoring.use-case';
import { CreateMediaMonitoringRecordUseCase } from '../../application/use-cases/media-monitoring/create-media-monitoring-record.use-case';
import { CreateMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/create-media-monitoring-record.dto';

const mediaMonitoringRepo = new MediaMonitoringRecordRepository();

const fetchUnlinkedMediaMonitoringUseCase = new FetchUnlinkedMediaMonitoringUseCase(mediaMonitoringRepo);
const createMediaMonitoringRecordUseCase = new CreateMediaMonitoringRecordUseCase(mediaMonitoringRepo);

export async function fetchUnlinkedMediaMonitoring(_req: Request, res: Response, next: NextFunction) {
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

export async function createMediaMonitoringRecord(req: Request, res: Response, next: NextFunction) {
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
