import { Request, Response, NextFunction } from 'express';
import { FetchSubCategoriesByCategoryUseCase } from '../../application/use-cases/sub-categories/fetch-by-category.use-case';
import { CreateSubCategoryUseCase } from '../../application/use-cases/sub-categories/create-sub-category.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createSubCategoryHandlers(
  deps: Pick<ApiRouterDeps, 'subCategoryRepository' | 'categoryRepository'>,
) {
  const { subCategoryRepository, categoryRepository } = deps;

  const fetchSubCategoriesByCategoryUseCase = new FetchSubCategoriesByCategoryUseCase(
    subCategoryRepository,
  );
  const createSubCategoryUseCase = new CreateSubCategoryUseCase(subCategoryRepository, categoryRepository);

  async function fetchSubCategoriesByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params as { categoryId: string };
      const subCategories = await fetchSubCategoriesByCategoryUseCase.execute(categoryId);

      res.status(200).json({
        status: 'SUCCESS',
        data: { subCategories },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as { categoryId: string; name: string; nameSlug?: string; isCustom?: boolean };
      const subCategory = await createSubCategoryUseCase.execute({
        categoryId: payload.categoryId,
        name: payload.name,
        nameSlug: payload.nameSlug,
        isCustom: payload.isCustom,
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Sub-category created successfully',
        data: { subCategory },
      });
    } catch (error) {
      next(error);
    }
  }

  return { fetchSubCategoriesByCategory, createSubCategory };
}
