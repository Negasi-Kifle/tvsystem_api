import { Router } from 'express';
import { createEmployeeHandlers } from '../controllers/employee.controller';
import { createEmployeeDto } from '../dtos/requests/employee/create-emp.dto';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { fetchAllEmployeesDto } from '../dtos/requests/employee/fetch-all-emps.dto';
import { validateQuery } from '../validators/validate-query';
import { updateEmployeeDto } from '../dtos/requests/employee/update-emp.dto';
import { updateEmployeeStatusDto } from '../dtos/requests/employee/update-status.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createEmployeeRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployee,
    getEmployeesWithoutUserAccount,
    updateEmployee,
    updateEmployeeStatus,
  } = createEmployeeHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_EMPLOYEES),
      validateBody(createEmployeeDto),
      createEmployee,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_EMPLOYEES),
      validateQuery(fetchAllEmployeesDto),
      getAllEmployees,
    );

  router.get(
    '/without-user-account',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_EMPLOYEES),
    validateQuery(fetchAllEmployeesDto),
    getEmployeesWithoutUserAccount,
  );

  router
    .route('/:id/status')
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_EMPLOYEES),
      validateBody(updateEmployeeStatusDto),
      updateEmployeeStatus,
    );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), getEmployee)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_EMPLOYEES),
      validateBody(updateEmployeeDto),
      updateEmployee,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), deleteEmployee);

  return router;
}
