// TODO: Ensure MANAGE_SALES and VIEW_SALES are granted to Sales Rep, Sales Assistant, Sales Manager, CEO via user management UI
import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createCustomerDto } from '../dtos/requests/customer/create-customer.dto';
import { updateCustomerDto } from '../dtos/requests/customer/update-customer.dto';
import { fetchAllCustomersDto } from '../dtos/requests/customer/fetch-all-customers.dto';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  fetchAllCustomers,
  deleteCustomerById,
} from '../controllers/customer.controller';

const router = Router();

router
  .route('/')
  .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), validateBody(createCustomerDto), createCustomer)
  .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), validateQuery(fetchAllCustomersDto), fetchAllCustomers);

router
  .route('/:id')
  .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getCustomerById)
  .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), validateBody(updateCustomerDto), updateCustomer)
  .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), deleteCustomerById);

export default router;
