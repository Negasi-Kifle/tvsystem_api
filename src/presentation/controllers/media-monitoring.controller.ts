import { Request, Response, NextFunction } from 'express';
import { FetchUnlinkedMediaMonitoringUseCase } from '../../application/use-cases/media-monitoring/fetch-unlinked-media-monitoring.use-case';
import { CreateMediaMonitoringRecordUseCase } from '../../application/use-cases/media-monitoring/create-media-monitoring-record.use-case';
import { FetchAllMediaMonitoringRecordsUseCase } from '../../application/use-cases/media-monitoring/fetch-all-media-monitoring-records.use-case';
import { CountMediaMonitoringRecordsUseCase } from '../../application/use-cases/media-monitoring/count-media-monitoring-records.use-case';
import { GetMediaMonitoringRecordByIdUseCase } from '../../application/use-cases/media-monitoring/get-media-monitoring-record-by-id.use-case';
import { UpdateMediaMonitoringRecordUseCase } from '../../application/use-cases/media-monitoring/update-media-monitoring-record.use-case';
import { DeleteMediaMonitoringRecordByIdUseCase } from '../../application/use-cases/media-monitoring/delete-media-monitoring-record-by-id.use-case';
import { CreateMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/create-media-monitoring-record.dto';
import type { FetchAllMediaMonitoringRecordsDto } from '../dtos/requests/media-monitoring/fetch-all-media-monitoring-records.dto';
import type { UpdateMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/update-media-monitoring-record.dto';
import { mapFetchAllMediaMonitoringRecordsDtoToQueryOptions } from '../mappers/media-monitoring-to-query-options.mapper';
import type { ApiRouterDeps } from '../api-router-deps';

export function createMediaMonitoringHandlers(
  deps: Pick<ApiRouterDeps, 'mediaMonitoringRecordRepository' | 'customerRepository'>,
) {
  const { mediaMonitoringRecordRepository, customerRepository } = deps;

  const fetchUnlinkedMediaMonitoringUseCase = new FetchUnlinkedMediaMonitoringUseCase(
    mediaMonitoringRecordRepository,
  );
  const createMediaMonitoringRecordUseCase = new CreateMediaMonitoringRecordUseCase(
    mediaMonitoringRecordRepository,
    customerRepository,
  );
  const fetchAllMediaMonitoringRecordsUseCase = new FetchAllMediaMonitoringRecordsUseCase(
    mediaMonitoringRecordRepository,
  );
  const countMediaMonitoringRecordsUseCase = new CountMediaMonitoringRecordsUseCase(
    mediaMonitoringRecordRepository,
  );
  const getMediaMonitoringRecordByIdUseCase = new GetMediaMonitoringRecordByIdUseCase(
    mediaMonitoringRecordRepository,
  );
  const updateMediaMonitoringRecordUseCase = new UpdateMediaMonitoringRecordUseCase(
    mediaMonitoringRecordRepository,
    customerRepository,
  );
  const deleteMediaMonitoringRecordByIdUseCase = new DeleteMediaMonitoringRecordByIdUseCase(
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

  async function fetchAllMediaMonitoringRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllMediaMonitoringRecordsDto;
      const queryOptions = mapFetchAllMediaMonitoringRecordsDtoToQueryOptions(dto);
      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [records, total] = await Promise.all([
        fetchAllMediaMonitoringRecordsUseCase.execute(queryOptions),
        countMediaMonitoringRecordsUseCase.execute(queryOptions.filters),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
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
        customerId: payload.customerId,
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

  async function getMediaMonitoringRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const record = await getMediaMonitoringRecordByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { record },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateMediaMonitoringRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateMediaMonitoringRecordDto;
      const record = await updateMediaMonitoringRecordUseCase.execute(id, {
        channel: payload.channel,
        sponsorName: payload.sponsorName,
        monitoringDate: payload.monitoringDate,
        showName: payload.showName,
        timeSlot: payload.timeSlot,
        statusWithUs: payload.statusWithUs,
        contactInfo: payload.contactInfo,
        customerId: payload.customerId,
      });

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Media monitoring record updated successfully',
        data: { record },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteMediaMonitoringRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteMediaMonitoringRecordByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Media monitoring record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    fetchUnlinkedMediaMonitoring,
    fetchAllMediaMonitoringRecords,
    createMediaMonitoringRecord,
    getMediaMonitoringRecordById,
    updateMediaMonitoringRecord,
    deleteMediaMonitoringRecordById,
  };
}
