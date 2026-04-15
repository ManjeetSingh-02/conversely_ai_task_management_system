// internal-imports
import { ErrorResponse, SuccessResponse, tasks } from '@/core/index.js';

// type-imports
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// type definition for authenticated request
type AuthenticatedRequest = Request & { user?: { id: string } };

// controller for module
export const controller = {
  // @controller POST /
  createTask: async (
    request: AuthenticatedRequest,
    response: Response<ISuccessResponse<object> | IErrorResponse<null>>
  ) => {
    // check if task already exists
    const existingTask = await tasks.findOne({ title: request.body.title }).select('id').lean();
    if (existingTask)
      return response.status(409).json(
        new ErrorResponse({
          code: 'TASK_ALREADY_EXISTS',
          message: 'A task with this title already exists',
          issues: null,
        })
      );

    // create new task in database
    const newTask = await tasks.create({
      title: request.body.title,
      description: request.body.description,
      createdBy: request.user?.id,
      dueDate: request.body.dueDate,
    });

    // return success response with new task data
    return response.status(201).json(
      new SuccessResponse({
        message: 'Task created successfully',
        data: {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          dueDate: newTask.dueDate,
        },
      })
    );
  },

  // @controller GET /
  getTasks: async (
    request: AuthenticatedRequest,
    response: Response<ISuccessResponse<Array<object>>>
  ) => {
    // fetch all user tasks from database
    const userTasks = await tasks
      .find({ createdBy: request.user?.id })
      .select('_id title status')
      .lean();

    // return success response with user tasks data
    return response.status(200).json(
      new SuccessResponse({
        message: 'Tasks retrieved successfully',
        data: userTasks,
      })
    );
  },

  // @controller GET /:id
  getTask: async (
    request: AuthenticatedRequest,
    response: Response<ISuccessResponse<object> | IErrorResponse<null>>
  ) => {
    // fetch task by id from database
    const existingTask = await tasks
      .findOne({
        _id: request.params.id,
        createdBy: request.user?.id,
      })
      .select('-createdBy -__v')
      .lean();
    if (!existingTask)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TASK_NOT_FOUND',
          message: 'No task found with the provided ID for the authenticated user',
          issues: null,
        })
      );

    // return success response with task data
    return response.status(200).json(
      new SuccessResponse({
        message: 'Task retrieved successfully',
        data: existingTask,
      })
    );
  },

  // @controller PATCH /:id
  updateTask: () => {},

  // @controller DELETE /:id
  deleteTask: () => {},
};
