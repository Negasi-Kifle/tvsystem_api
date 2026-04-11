import { NextFunction, Request, Response } from 'express';
import { UploadSatelliteLogUseCase } from '../../application/use-cases/satellite-log/upload-satellite-log.use-case';
import { MatchLogToPlacementsUseCase } from '../../application/use-cases/satellite-log/match-log-to-placements.use-case';
import { VerifyAdvertDeliveryUseCase } from '../../application/use-cases/satellite-log/verify-advert-delivery.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createSatelliteLogHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'satelliteLogUploadRepository'
    | 'satelliteLogEntryRepository'
    | 'advertPlacementRepository'
  >,
) {
  const uploadUseCase = new UploadSatelliteLogUseCase(
    deps.satelliteLogUploadRepository,
    deps.satelliteLogEntryRepository,
  );
  const matchUseCase = new MatchLogToPlacementsUseCase(
    deps.satelliteLogUploadRepository,
    deps.satelliteLogEntryRepository,
    deps.advertPlacementRepository,
  );
  const verifyUseCase = new VerifyAdvertDeliveryUseCase(
    deps.advertPlacementRepository,
    deps.satelliteLogEntryRepository,
  );

  async function upload(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file;
      const { logDate } = req.body as { logDate: string };
      const userId = (req as any).user?.id ?? 'system';

      const result = await uploadUseCase.execute({
        logDate: new Date(logDate),
        uploadedById: userId,
        fileName: file?.originalname ?? 'unknown',
        fileContent: file?.buffer?.toString('utf-8') ?? '',
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Satellite log uploaded and parsed',
        data: { upload: result },
      });
    } catch (error) {
      next(error);
    }
  }

  async function list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const uploads = await deps.satelliteLogUploadRepository.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await deps.satelliteLogUploadRepository.count();
      res.status(200).json({
        status: 'SUCCESS',
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: { uploads },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const upload = await deps.satelliteLogUploadRepository.findById(String(id));
      if (!upload) {
        return res.status(404).json({ status: 'ERROR', message: 'Upload not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: { upload } });
    } catch (error) {
      next(error);
    }
  }

  async function getEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const entries = await deps.satelliteLogEntryRepository.findByUploadId(String(id));
      res.status(200).json({ status: 'SUCCESS', data: { entries } });
    } catch (error) {
      next(error);
    }
  }

  async function matchEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await matchUseCase.execute(String(id));
      res.status(200).json({ status: 'SUCCESS', data: result });
    } catch (error) {
      next(error);
    }
  }

  async function verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await verifyUseCase.execute(String(id));
      res.status(200).json({ status: 'SUCCESS', data: result });
    } catch (error) {
      next(error);
    }
  }

  async function manualMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { placementId } = req.body as { placementId: string };
      const entry = await deps.satelliteLogEntryRepository.findById(String(id));
      if (!entry) {
        return res.status(404).json({ status: 'ERROR', message: 'Entry not found' });
      }
      entry.matchedPlacementId = placementId;
      entry.matchType = 'MANUAL' as any;
      const updated = await deps.satelliteLogEntryRepository.update(entry);
      res.status(200).json({ status: 'SUCCESS', data: { entry: updated } });
    } catch (error) {
      next(error);
    }
  }

  return { upload, list, getById, getEntries, matchEntries, verify, manualMatch };
}
