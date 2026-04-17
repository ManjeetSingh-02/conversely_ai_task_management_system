// internal-imports
import { categories, ErrorResponse, SuccessResponse } from '@/core/index.js';

// type-imports
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller POST /
  createCategory: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // check if category already exists
    const existingCategory = await categories
      .findOne({ name: request.body.name })
      .select('id')
      .lean();
    if (existingCategory)
      return response.status(409).json(
        new ErrorResponse({
          code: 'CATEGORY_ALREADY_EXISTS',
          message: 'A category with this name already exists',
        })
      );

    // create new category in database
    const newCategory = await categories.create({
      name: request.body.name,
      createdBy: request.user!.id,
    });

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
    // fetch category by id from database
    const existingCategory = await categories.findOne({
      _id: request.params.id,
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
      _id: { $ne: request.params.id },
      name: request.body.name,
      createdBy: request.user!.id,
    });
    if (categoryWithSameName)
      return response.status(409).json(
        new ErrorResponse({
          code: 'CATEGORY_ALREADY_EXISTS',
          message: 'Another category with this name already exists',
        })
      );

    // update category name in database
    existingCategory.name = request.body.name;
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
    // fetch category by id from database
    const existingCategory = await categories.findOne({
      _id: request.params.id,
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
