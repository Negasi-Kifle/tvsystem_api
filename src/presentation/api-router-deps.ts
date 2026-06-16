import type { RequestHandler } from 'express';
import type { AppContainer } from '../composition/app-container';
import type { IStorageService } from '../domain/services/storage.service';

export type ApiRouterDeps = AppContainer & {
  storageService: IStorageService;
  advertPackageImageUpload: RequestHandler;
  advertSchedulePdfUpload: RequestHandler;
  advertScheduleFileUpload: RequestHandler;
  authMiddleware: RequestHandler;
};
