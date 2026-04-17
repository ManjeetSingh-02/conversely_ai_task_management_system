// internal-imports
import { tags, ErrorResponse, SuccessResponse } from '@/core/index.js';

// type-imports
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller POST /
  createTag: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // check if tag already exists
    const existingTag = await tags.findOne({ name: request.body.name }).select('id').lean();
    if (existingTag)
      return response.status(409).json(
        new ErrorResponse({
          code: 'TAG_ALREADY_EXISTS',
          message: 'A tag with this name already exists',
        })
      );

    // create new tag in database
    const newTag = await tags.create({
      name: request.body.name,
      createdBy: request.user!.id,
    });

    // return success response with new tag data
    return response.status(201).json(
      new SuccessResponse({
        message: 'Tag created successfully',
        data: {
          id: newTag.id,
          name: newTag.name,
        },
      })
    );
  },

  // @controller GET /
  getTags: async (request: Request, response: Response<ISuccessResponse<object>>) => {
    // fetch all user tags from database
    const userTags = await tags
      .find({ createdBy: request.user!.id })
      .select('_id name createdAt updatedAt')
      .lean();

    // return success response with user tags data
    return response.status(200).json(
      new SuccessResponse({
        message: 'Tags retrieved successfully',
        data: userTags,
      })
    );
  },

  // @controller PATCH /:id
  updateTag: async (request: Request, response: Response<ISuccessResponse | IErrorResponse>) => {
    // fetch tag by id from database
    const existingTag = await tags.findOne({
      _id: request.params.id,
      createdBy: request.user!.id,
    });
    if (!existingTag)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TAG_NOT_FOUND',
          message: 'No tag found with the provided ID for the authenticated user',
        })
      );

    // check if new tag name already exists for another tag
    const tagWithSameName = await tags.findOne({
      _id: { $ne: request.params.id },
      name: request.body.name,
      createdBy: request.user!.id,
    });
    if (tagWithSameName)
      return response.status(409).json(
        new ErrorResponse({
          code: 'TAG_ALREADY_EXISTS',
          message: 'Another tag with this name already exists',
        })
      );

    // update tag name in database
    existingTag.name = request.body.name;
    await existingTag.save();

    // return success response indicating successful update
    return response.status(200).json(
      new SuccessResponse({
        message: 'Tag updated successfully',
      })
    );
  },

  // @controller DELETE /:id
  deleteTag: async (request: Request, response: Response<ISuccessResponse | IErrorResponse>) => {
    // fetch tag by id from database
    const existingTag = await tags.findOne({
      _id: request.params.id,
      createdBy: request.user!.id,
    });
    if (!existingTag)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TAG_NOT_FOUND',
          message: 'No tag found with the provided ID for the authenticated user',
        })
      );

    // delete tag from database
    await tags.findByIdAndDelete(existingTag._id);

    // return success response indicating successful deletion
    return response.status(200).json(
      new SuccessResponse({
        message: 'Tag deleted successfully',
      })
    );
  },
};
