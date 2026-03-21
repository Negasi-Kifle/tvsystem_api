import { Request, Response, NextFunction } from 'express';
import { CategoryRepository } from '../../infrastructure/prisma/repositories/category.repository';
import { FetchAllCategoriesUseCase } from '../../application/use-cases/categories/fetch-all-categories.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/categories/create-category.use-case';
import { CreateCategoryDto } from '../dtos/requests/category/create-category.dto';

const categoryRepo = new CategoryRepository();
const fetchAllCategoriesUseCase = new FetchAllCategoriesUseCase(categoryRepo);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo);

export async function fetchAllCategories(_req: Request, res: Response, next: NextFunction) {
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

export async function createCategory(req: Request, res: Response, next: NextFunction) {
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
