import { Request, Response, NextFunction } from 'express';
import { FetchAllCategoriesUseCase } from '../../application/use-cases/categories/fetch-all-categories.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/categories/create-category.use-case';
import { GetCategoryByIdUseCase } from '../../application/use-cases/categories/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/categories/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/categories/delete-category.use-case';
import { CreateCategoryDto } from '../dtos/requests/category/create-category.dto';
import type { UpdateCategoryDto } from '../dtos/requests/category/update-category.dto';
import type { ApiRouterDeps } from '../api-router-deps';
import { FetchAllCategoriesDto } from '../dtos/requests/category/fetch-all-categories.dto';
import { mapFetchAllCategoriesDtoToQueryOptions } from '../mappers/category-to-query-options.mapper';
import { CountCategoriesUseCase } from '../../application/use-cases/categories/count-categories.use-case';

export function createCategoryHandlers(deps: Pick<ApiRouterDeps, 'categoryRepository'>) {
  const { categoryRepository } = deps;
  const fetchAllCategoriesUseCase = new FetchAllCategoriesUseCase(categoryRepository);
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
  const countCategoriesUseCase = new CountCategoriesUseCase(categoryRepository);

  async function fetchAllCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllCategoriesDto;
      const queryOptions = mapFetchAllCategoriesDtoToQueryOptions(dto);

      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [categories, total] = await Promise.all([
        fetchAllCategoriesUseCase.execute(queryOptions),
        countCategoriesUseCase.execute(queryOptions.filters),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
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

  async function getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const category = await getCategoryByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateCategoryDto;
      const category = await updateCategoryUseCase.execute(id, payload);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Category updated successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const category = await deleteCategoryUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return { fetchAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory };
}
