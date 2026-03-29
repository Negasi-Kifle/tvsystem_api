/**
 * Permission checks are pure Express handlers; auth JWT + user load is built in bootstrap
 * (`createAuthMiddleware`) and passed on `ApiRouterDeps.authMiddleware`.
 */
export { requirePermission } from '../infrastructure/middlewares/permission.middleware';
