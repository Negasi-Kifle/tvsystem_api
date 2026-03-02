import { Router } from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee, updateEmployeeStatus } from "../controllers/employee.controller";
import { createEmployeeDto } from "../dtos/requests/employee/create-emp.dto";
import { validateBody } from "../validators/validate-body";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { fetchAllEmployeesDto } from "../dtos/requests/employee/fetch-all-emps.dto";
import { validateQuery } from "../validators/validate-query";
import { updateEmployeeDto } from "../dtos/requests/employee/update-emp.dto";
import { updateEmployeeStatusDto } from "../dtos/requests/employee/update-status.dto";

const router = Router();

router.route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), validateBody(createEmployeeDto), createEmployee)
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), validateQuery(fetchAllEmployeesDto), getAllEmployees)
    

router.route('/:id/status')
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), validateBody(updateEmployeeStatusDto), updateEmployeeStatus);   

router.route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), getEmployee)
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), validateBody(updateEmployeeDto), updateEmployee)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_EMPLOYEES), deleteEmployee);

export default router;