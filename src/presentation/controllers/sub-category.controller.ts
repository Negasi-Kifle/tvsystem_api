import { Request, Response, NextFunction } from 'express';
import { SubCategoryRepository } from '../../infrastructure/prisma/repositories/sub-category.repository';
import { CategoryRepository } from '../../infrastructure/prisma/repositories/category.repository';
import { FetchSubCategoriesByCategoryUseCase } from '../../application/use-cases/sub-categories/fetch-by-category.use-case';
import { CreateSubCategoryUseCase } from '../../application/use-cases/sub-categories/create-sub-category.use-case';

const subCategoryRepo = new SubCategoryRepository();
const categoryRepo = new CategoryRepository();
const fetchSubCategoriesByCategoryUseCase = new FetchSubCategoriesByCategoryUseCase(subCategoryRepo);
const createSubCategoryUseCase = new CreateSubCategoryUseCase(subCategoryRepo, categoryRepo);

export async function fetchSubCategoriesByCategory(req: Request, res: Response, next: NextFunction) {
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

export async function createSubCategory(req: Request, res: Response, next: NextFunction) {
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
