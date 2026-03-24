import express, { type Express } from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createApiRouter, type ApiRouterDeps } from './routes';
import { sendErrorResponse } from '../shared/utils/error-handler';
import globalErrorHandler from '../shared/utils/global-error-handler';

export type CreateAppDeps = ApiRouterDeps;

export function createApp(deps: CreateAppDeps): Express {
  const app = express();

  if (process.env.STORAGE_TYPE !== 's3') {
    app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
  }

  app.use(express.json());
  app.use(cors({ origin: '*', credentials: false }));
  app.use(helmet());
  app.use(morgan('combined'));

  app.use('/api', createApiRouter(deps));

  app.use(/.*/, (req, res) => {
    sendErrorResponse(res, 404, 'API endpoint not found');
  });

  app.use(globalErrorHandler);

  return app;
}
