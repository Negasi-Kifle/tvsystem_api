import { NextFunction, Request, Response } from 'express';

interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

// Helper function to send standardized error responses
export function sendErrorResponse(res: Response, status: number, message: string, error?: Error) {
  const isDev = process.env.NODE_ENV !== 'production';

  const response: { status: string; message: string; errorStack?: string } = {
    status: 'FAIL',
    message
  };

  if (isDev && error?.stack) {
    response.errorStack = error.stack;
  }

  res.status(status).json(response);
}

// Basic global error handler
export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  sendErrorResponse(res, status, message, err);
}
