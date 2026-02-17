import { NextFunction, Request, Response } from 'express';
import { sendErrorResponse } from '../../shared/utils/error-handler';

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.user?.permissions ?? [];
    console.log(permissions);
    if (!permissions.includes(permission)) {
      const error = new Error('Forbidden');
      return sendErrorResponse(res, 403, 'Forbidden', error);
    }
    next();
  };
}
