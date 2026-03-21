import { EntityNotFoundError, EntityAlreadyExistsError, ValidationError } from "../../domain/errors";
import { CommunicationLogWriteOnlyError } from "../../domain/errors/communication-log-write-only.error";
import { Request, Response, NextFunction } from "express";
import { Exception } from "./error-constructor";
import { Code } from "./http_code";
import { isPrismaKnownRequestError, prismaErrorToHttpPayload } from "../../infrastructure/prisma/exceptions";

const env = process.env;

const isDev = () => env.NODE_ENV === "dev" || env.NODE_ENV === "local";



// Map application/domain errors to HTTP (presentation layer responsibility)
function toHttpPayload(err: unknown): { statusCode: number; message: string; stack?: string } {
  if (err instanceof EntityNotFoundError) {
    return { statusCode: Code.ENTITY_NOT_FOUND_ERROR.code, message: err.message };
  }
  
  if (err instanceof Exception) {
    return { statusCode: err.code, message: err.message };
  }

  if (err instanceof EntityAlreadyExistsError) {
    return { statusCode: Code.ENTITY_ALREADY_EXISTS_ERROR.code, message: err.message };
  }
  
  if(err instanceof ValidationError) {
    return { statusCode: Code.ENTITY_VALIDATION_ERROR.code, message: err.message };
  }

  if (err instanceof CommunicationLogWriteOnlyError) {
    return { statusCode: Code.BAD_REQUEST_ERROR.code, message: err.message };
  }

  if (isPrismaKnownRequestError(err)) {
    return prismaErrorToHttpPayload(err);
  }
  
  return { statusCode: 500, message: "Internal server error" };
}

function sendError(res: Response, statusCode: number, message: string, stack?: string) {
  res.status(statusCode).json({
    status: 'ERROR',
    message,
    ...(isDev() && stack && { errorStack: stack }),
  });
}

/**
 * Error handler middleware. Maps application errors to HTTP responses.
 */
export default function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { statusCode, message } = toHttpPayload(err);
  const stack = err instanceof Error ? err.stack : undefined;
  sendError(res, statusCode, message, stack);
}
