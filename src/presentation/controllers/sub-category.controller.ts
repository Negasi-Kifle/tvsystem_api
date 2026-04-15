import { Request, Response, NextFunction } from 'express';
import { FetchSubCategoriesByCategoryUseCase } from '../../application/use-cases/sub-categories/fetch-by-category.use-case';
import { CreateSubCategoryUseCase } from '../../application/use-cases/sub-categories/create-sub-category.use-case';
import { GetSubCategoryByIdUseCase } from '../../application/use-cases/sub-categories/get-sub-category-by-id.use-case';
import { UpdateSubCategoryUseCase } from '../../application/use-cases/sub-categories/update-sub-category.use-case';
import { DeleteSubCategoryUseCase } from '../../application/use-cases/sub-categories/delete-sub-category.use-case';
import type { UpdateSubCategoryDto } from '../dtos/requests/sub-category/update-sub-category.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createSubCategoryHandlers(
  deps: Pick<ApiRouterDeps, 'subCategoryRepository' | 'categoryRepository'>,
) {
  const { subCategoryRepository, categoryRepository } = deps;

  const fetchSubCategoriesByCategoryUseCase = new FetchSubCategoriesByCategoryUseCase(
    subCategoryRepository,
  );
  const createSubCategoryUseCase = new CreateSubCategoryUseCase(subCategoryRepository, categoryRepository);
  const getSubCategoryByIdUseCase = new GetSubCategoryByIdUseCase(subCategoryRepository);
  const updateSubCategoryUseCase = new UpdateSubCategoryUseCase(subCategoryRepository, categoryRepository);
  const deleteSubCategoryUseCase = new DeleteSubCategoryUseCase(subCategoryRepository);

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

  async function getSubCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const subCategory = await getSubCategoryByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { subCategory },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateSubCategoryDto;
      const subCategory = await updateSubCategoryUseCase.execute(id, payload);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Sub-category updated successfully',
        data: { subCategory },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const subCategory = await deleteSubCategoryUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Sub-category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    fetchSubCategoriesByCategory,
    createSubCategory,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
  };
}
