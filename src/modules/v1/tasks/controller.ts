// internal-imports
import {
  APP_CONFIG,
  categories,
  env,
  ErrorResponse,
  queue,
  SuccessResponse,
  tags,
  tasks,
} from '@/core/index.js';

// type-imports
import type {
  createTaskSchema,
  getTaskAndDeleteTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from './zod.js';
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';
import type z from 'zod';

// controller for module
export const controller = {
  // @controller POST /
  createTask: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // get data from validated request
    const { title, description, dueDate, categoryId, tagIds } = request.validated!.body! as z.infer<
      typeof createTaskSchema
    >['body'];

    // check if task already exists
    const existingTask = await tasks
      .findOne({ title, createdBy: request.user!.id })
      .select('id')
      .lean();
    if (existingTask)
      return response.status(409).json(
        new ErrorResponse({
          code: 'TASK_ALREADY_EXISTS',
          message: 'A task with this title already exists for the authenticated user',
        })
      );

    // object to hold fields required for task creation
    const creationData: Record<string, unknown> = {
      title,
      description,
      dueDate,
      createdBy: request.user!.id,
    };

    // if categoryId is provided, check if it exists and add it in creationData
    if (categoryId) {
      const existingCategory = await categories
        .findOne({ _id: categoryId, createdBy: request.user!.id })
        .select('id')
        .lean();
      if (!existingCategory)
        return response.status(400).json(
          new ErrorResponse({
            code: 'INVALID_CATEGORY',
            message: 'Category does not exist for the authenticated user',
          })
        );

      // add category in creationData
      creationData.category = existingCategory._id;
    }

    // if tagIds are provided, check if they exist and add it in creationData
    if (tagIds) {
      // remove duplicate tagIds
      const uniqueTagIds = Array.from(new Set(tagIds));
      const existingTags = await tags
        .find({ _id: { $in: uniqueTagIds }, createdBy: request.user!.id })
        .select('id')
        .lean();

      // if any of the provided tagIds does not exist, return error response
      if (existingTags.length !== uniqueTagIds.length)
        return response.status(400).json(
          new ErrorResponse({
            code: 'INVALID_TAGS',
            message: 'Some tags do not exist for the authenticated user',
          })
        );

      // add tags in creationData
      creationData.tags = existingTags.map(tag => tag._id);
    }

    // create new task in database
    const newTask = await tasks.create(creationData);

    // add a job in reminder queue to send reminder 1 hour before task due date
    const reminderTime = new Date(newTask.dueDate.getTime() - env.REMINDER_TIME_BEFORE_DUE_DATE);
    await queue.add(
      `reminder_${newTask._id}`,
      {
        message: `Your task "${newTask.title}" is due in ${env.REMINDER_TIME_BEFORE_DUE_DATE / 60000} minutes`,
      },
      { delay: reminderTime.getTime() - Date.now() }
    );

    // return success response with new task data
    return response.status(201).json(
      new SuccessResponse({
        message: 'Task created successfully',
        data: { id: newTask.id, status: newTask.status },
      })
    );
  },

  // @controller GET /
  getTasks: async (request: Request, response: Response<ISuccessResponse<object>>) => {
    // get data from validated request
    const { category, tag } = request.validated!.query! as z.infer<typeof getTasksSchema>['query'];

    // constants to hold query and sort filters
    const queryFilters: Record<string, unknown> = { createdBy: request.user!.id };

    // if category filter is provided add it in filters object
    if (category) queryFilters.category = category;

    // if tag filter is provided add it in filters object
    if (tag) queryFilters.tags = { $in: [tag] };

    // fetch all user tasks from database
    const userTasks = await tasks.find(queryFilters).select('_id title status').lean();

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
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // get data from validated request
    const { id } = request.validated!.params! as z.infer<
      typeof getTaskAndDeleteTaskSchema
    >['params'];

    // fetch task by id from database
    const existingTask = await tasks
      .findOne({ _id: id, createdBy: request.user!.id })
      .select('-createdBy -__v')
      .populate([
        { path: 'category', select: 'name -_id' },
        { path: 'tags', select: 'name -_id' },
      ])
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
    // get data from validated request
    const { categoryId, description, dueDate, status, tagIds } = request.validated!
      .body! as z.infer<typeof updateTaskSchema>['body'];
    const { id } = request.validated!.params! as z.infer<typeof updateTaskSchema>['params'];

    // fetch task by id from database
    const existingTask = await tasks.findOne({ _id: id, createdBy: request.user!.id });
    if (!existingTask)
      return response.status(404).json(
        new ErrorResponse({
          code: 'TASK_NOT_FOUND',
          message: 'No task found with the provided ID for the authenticated user',
        })
      );

    // update task description, if provided
    if (description) existingTask.description = description;

    // update task status, if provided
    if (status) {
      // check if new status is completed
      if (status === APP_CONFIG.TASK_CONFIG.STATUS.COMPLETED) {
        // remove existing job for task from reminder queue, if exists
        const existingJob = await queue.getJob(`reminder_${existingTask._id}`);
        if (existingJob) await existingJob.remove();

        // send a webhook immediately to notify user about task completion
      } else {
        // calculate reminder time based on task due date
        const reminderTime = new Date(
          existingTask.dueDate.getTime() - env.REMINDER_TIME_BEFORE_DUE_DATE
        );

        // add a job in reminder queue with task old due date
        await queue.add(
          `reminder_${existingTask._id}`,
          {
            message: `Your task "${existingTask.title}" is due in ${env.REMINDER_TIME_BEFORE_DUE_DATE / 60000} minutes`,
          },
          { delay: reminderTime.getTime() - Date.now() }
        );
      }

      // update task status in database
      existingTask.status = status;
    }

    // update task dueDate, if provided
    if (dueDate) {
      // get existing job for task from reminder queue
      const existingJob = await queue.getJob(`reminder_${existingTask._id}`);

      // calculate new reminder time based on new due date
      const reminderTime = new Date(dueDate.getTime() - env.REMINDER_TIME_BEFORE_DUE_DATE);

      // check if a job already exists, change its delay
      if (existingJob) await existingJob.changeDelay(reminderTime.getTime() - Date.now());
      else {
        // add a job in reminder queue
        await queue.add(
          `reminder_${existingTask._id}`,
          {
            message: `Your task "${existingTask.title}" is due in ${env.REMINDER_TIME_BEFORE_DUE_DATE / 60000} minutes`,
          },
          { delay: reminderTime.getTime() - Date.now() }
        );
      }

      // update task due date in database
      existingTask.dueDate = dueDate;
    }

    // if categoryId is provided, check if it exists and update task category
    if (categoryId) {
      // check if category exists in database
      const existingCategory = await categories
        .findOne({ _id: categoryId, createdBy: request.user!.id })
        .select('id')
        .lean();
      if (!existingCategory)
        return response.status(400).json(
          new ErrorResponse({
            code: 'INVALID_CATEGORY',
            message: 'Category does not exist for the authenticated user',
          })
        );

      // update task category in database
      existingTask.category = existingCategory._id;
    }

    // if tagIds are provided, check if they exist and update task tags
    if (tagIds) {
      // remove duplicate tagIds
      const uniqueTagIds = Array.from(new Set(tagIds));

      // fetch tags from database and check if they exist for the authenticated user
      const existingTags = await tags
        .find({ _id: { $in: uniqueTagIds }, createdBy: request.user!.id })
        .select('id')
        .lean();

      // if any of the provided tagIds does not exist, return error response
      if (existingTags.length !== uniqueTagIds.length)
        return response.status(400).json(
          new ErrorResponse({
            code: 'INVALID_TAGS',
            message: 'Some tags do not exist for the authenticated user',
          })
        );

      // update task tags in database
      existingTask.tags = existingTags.map(tag => tag._id);
    }

    // update task in database
    await existingTask.save();

    // return success response indicating successful update
    return response.status(200).json(
      new SuccessResponse({
        message: 'Task updated successfully',
      })
    );
  },

  // @controller DELETE /:id
  deleteTask: async (request: Request, response: Response<ISuccessResponse | IErrorResponse>) => {
    // get data from validated request
    const { id } = request.validated!.params! as z.infer<
      typeof getTaskAndDeleteTaskSchema
    >['params'];

    // fetch task by id from database
    const existingTask = await tasks
      .findOne({ _id: id, createdBy: request.user!.id })
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
