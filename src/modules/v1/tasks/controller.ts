// internal-imports
import { APP_CONFIG, ErrorResponse, SuccessResponse, tasks } from '@/core/index.js';

// type-imports
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// type definition for query
type Query = {
  status?: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
};

// controller for module
export const controller = {
  // @controller POST /
  createTask: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // check if task already exists
    const existingTask = await tasks.findOne({ title: request.body.title }).select('id').lean();
    if (existingTask)
      return response.status(409).json(
        new ErrorResponse({
          code: 'TASK_ALREADY_EXISTS',
          message: 'A task with this title already exists',
        })
      );

    // create new task in database
    const newTask = await tasks.create({
      title: request.body.title,
      description: request.body.description,
      createdBy: request.user!.id,
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
  getTasks: async (request: Request, response: Response<ISuccessResponse<object, object>>) => {
    // constants to hold query and filters
    const query = request.validated!.query as Query;
    const queryFilters: { createdBy: string; status?: string } = { createdBy: request.user!.id };
    const sortFilters: Record<string, 1 | -1> = {
      [query.sortBy]: query.sortOrder === APP_CONFIG.TASK_CONFIG.SORT_ORDERS.ASC ? 1 : -1,
    };

    // if status filter is provided add it in filters object
    if (query.status) queryFilters.status = query.status;

    // fetch all user tasks from database
    const userTasks = await tasks
      .find(queryFilters)
      .select('_id title status')
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .sort(sortFilters)
      .lean();

    // count total user tasks from database
    const totalUserTasksCount = await tasks.countDocuments({ createdBy: request.user!.id });

    // return success response with user tasks data
    return response.status(200).json(
      new SuccessResponse({
        message: 'Tasks retrieved successfully',
        data: userTasks,
        meta: {
          page: query.page,
          limit: query.limit,
          count: userTasks.length,
          total: totalUserTasksCount,
          pages: Math.ceil(totalUserTasksCount / query.limit),
        },
      })
    );
  },

  // @controller GET /:id
  getTask: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // fetch task by id from database
    const existingTask = await tasks
      .findOne({
        _id: request.params.id,
        createdBy: request.user!.id,
      })
      .select('-createdBy -__v')
      .lean();
    if (!existingTask)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TASK_NOT_FOUND',
          message: 'No task found with the provided ID for the authenticated user',
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
  updateTask: async (request: Request, response: Response<ISuccessResponse | IErrorResponse>) => {
    // fetch task by id from database
    const existingTask = await tasks.findOne({
      _id: request.params.id,
      createdBy: request.user!.id,
    });
    if (!existingTask)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TASK_NOT_FOUND',
          message: 'No task found with the provided ID for the authenticated user',
        })
      );

    // object to hold fields that needs to be updated
    const updationData: {
      description?: string;
      status?: string;
      dueDate?: Date;
    } = {};

    // add task fields in updationData if provided
    if (request.body.description) updationData.description = request.body.description;
    if (request.body.status) updationData.status = request.body.status;
    if (request.body.dueDate) updationData.dueDate = request.body.dueDate;

    // update task in database
    await tasks.findByIdAndUpdate(existingTask._id, updationData);

    // return success response indicating successful update
    return response.status(200).json(
      new SuccessResponse({
        message: 'Task updated successfully',
      })
    );
  },

  // @controller DELETE /:id
  deleteTask: async (request: Request, response: Response<ISuccessResponse | IErrorResponse>) => {
    // fetch task by id from database
    const existingTask = await tasks
      .findOne({
        _id: request.params.id,
        createdBy: request.user!.id,
      })
      .select('_id')
      .lean();
    if (!existingTask)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TASK_NOT_FOUND',
          message: 'No task found with the provided ID for the authenticated user',
        })
      );

    // delete task from database
    await tasks.findByIdAndDelete(existingTask._id);

    // return success response indicating successful update
    return response.status(200).json(
      new SuccessResponse({
        message: 'Task deleted successfully',
      })
    );
  },
};
