import { Request, Response, NextFunction } from 'express';
import { FetchAllCategoriesUseCase } from '../../application/use-cases/categories/fetch-all-categories.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/categories/create-category.use-case';
import { CreateCategoryDto } from '../dtos/requests/category/create-category.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCategoryHandlers(deps: Pick<ApiRouterDeps, 'categoryRepository'>) {
  const { categoryRepository } = deps;
  const fetchAllCategoriesUseCase = new FetchAllCategoriesUseCase(categoryRepository);
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

  async function fetchAllCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await fetchAllCategoriesUseCase.execute();

      res.status(200).json({
        status: 'SUCCESS',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateCategoryDto;
      const category = await createCategoryUseCase.execute({ name: payload.name, nameSlug: payload.nameSlug });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Category created successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  }

  return { fetchAllCategories, createCategory };
}
