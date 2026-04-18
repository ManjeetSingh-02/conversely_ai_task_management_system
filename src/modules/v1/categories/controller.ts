// internal-imports
import { categories, ErrorResponse, SuccessResponse } from '@/core/index.js';

// type-imports
import type { createCategorySchema, deleteCategorySchema, updateCategorySchema } from './zod.js';
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';
import type z from 'zod';

// controller for module
export const controller = {
  // @controller POST /
  createCategory: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // get data from validated request
    const { name } = request.validated!.body! as z.infer<typeof createCategorySchema>['body'];

    // check if category already exists
    const existingCategory = await categories
      .findOne({ name, createdBy: request.user!.id })
      .select('id')
      .lean();
    if (existingCategory)
      return response.status(409).json(
        new ErrorResponse({
          code: 'CATEGORY_ALREADY_EXISTS',
          message: 'A category with this name already exists for the authenticated user',
        })
      );

    // create new category in database
    const newCategory = await categories.create({ name, createdBy: request.user!.id });

    // return success response with new category data
    return response.status(201).json(
      new SuccessResponse({
        message: 'Category created successfully',
        data: {
          id: newCategory.id,
          name: newCategory.name,
        },
      })
    );
  },

  // @controller GET /
  getCategories: async (request: Request, response: Response<ISuccessResponse<object>>) => {
    // fetch all user categories from database
    const userCategories = await categories
      .find({ createdBy: request.user!.id })
      .select('_id name createdAt updatedAt')
      .lean();

    // return success response with user categories data
    return response.status(200).json(
      new SuccessResponse({
        message: 'Categories retrieved successfully',
        data: userCategories,
      })
    );
  },

  // @controller PATCH /:id
  updateCategory: async (
    request: Request,
    response: Response<ISuccessResponse | IErrorResponse>
  ) => {
    // get data from validated request
    const { name } = request.validated!.body! as z.infer<typeof updateCategorySchema>['body'];
    const { id } = request.validated!.params! as z.infer<typeof updateCategorySchema>['params'];

    // fetch category by id from database
    const existingCategory = await categories.findOne({
      _id: id,
      createdBy: request.user!.id,
    });
    if (!existingCategory)
      return response.status(404).json(
        new ErrorResponse({
          code: 'CATEGORY_NOT_FOUND',
          message: 'No category found with the provided ID for the authenticated user',
        })
      );

    // check if new category name already exists for another category
    const categoryWithSameName = await categories.findOne({
      _id: { $ne: id },
      name,
      createdBy: request.user!.id,
    });
    if (categoryWithSameName)
      return response.status(409).json(
        new ErrorResponse({
          code: 'CATEGORY_ALREADY_EXISTS',
          message: 'Another category with this name already exists for the authenticated user',
        })
      );

    // update category name in database
    existingCategory.name = name;
    await existingCategory.save();

    // return success response indicating successful update
    return response.status(200).json(
      new SuccessResponse({
        message: 'Category updated successfully',
      })
    );
  },

  // @controller DELETE /:id
  deleteCategory: async (
    request: Request,
    response: Response<ISuccessResponse | IErrorResponse>
  ) => {
    // get data from validated request
    const { id } = request.validated!.params! as z.infer<typeof deleteCategorySchema>['params'];

    // fetch category by id from database
    const existingCategory = await categories.findOne({
      _id: id,
      createdBy: request.user!.id,
    });
    if (!existingCategory)
      return response.status(404).json(
        new ErrorResponse({
          code: 'CATEGORY_NOT_FOUND',
          message: 'No category found with the provided ID for the authenticated user',
        })
      );

    // delete category from database
    await categories.findByIdAndDelete(existingCategory._id);

    // return success response indicating successful deletion
    return response.status(200).json(
      new SuccessResponse({
        message: 'Category deleted successfully',
      })
    );
  },
};
