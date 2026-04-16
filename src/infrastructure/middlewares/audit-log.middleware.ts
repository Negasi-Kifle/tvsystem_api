import type { NextFunction, Request, Response, RequestHandler } from 'express';
import type { RecordAuditLogUseCase } from '../../application/use-cases/audit/record-audit-log.use-case';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Records an audit row after the response finishes. `req.user` is populated if auth ran for the route.
 * Skips GET and OPTIONS; skips `/api/health` noise.
 */
export function createAuditLogMiddleware(recordAudit: RecordAuditLogUseCase): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      if (!MUTATING.has(req.method)) return;
      const path = req.originalUrl ?? req.url;
      if (path.includes('/health')) return;

      const userId = (req as Request & { user?: { id: string } }).user?.id ?? null;
      const segments = path.replace(/^\/api\/?/, '').split('/').filter(Boolean);
      const resourceType = segments[0] ?? 'api';
      const resourceId =
        (req.params as Record<string, string>).id ??
        (req.params as Record<string, string>).userId ??
        null;

      void recordAudit
        .execute({
          userId,
          action: `${req.method} ${path}`,
          resourceType,
          resourceId,
          metadata: { statusCode: res.statusCode },
          ipAddress: req.ip,
        })
        .catch((err: unknown) => {
          // eslint-disable-next-line no-console
          console.error('[AuditLog]', err);
        });
    });
    next();
  };
}
