// internal-imports
import { controller } from './controller.js';
import { createTaskSchema, updateTaskSchema } from './zod.js';
import { asyncHandler, authenticateUser, validateZodSchema } from '@/core/index.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route POST /
router.post(
  '/',
  asyncHandler(authenticateUser),
  validateZodSchema(createTaskSchema),
  asyncHandler(controller.createTask)
);

// @route GET /
router.get('/', asyncHandler(authenticateUser), asyncHandler(controller.getTasks));

// @route GET /:id
router.get('/:id', asyncHandler(authenticateUser), asyncHandler(controller.getTask));

// @route PATCH /:id
router.patch(
  '/:id',
  asyncHandler(authenticateUser),
  validateZodSchema(updateTaskSchema),
  asyncHandler(controller.updateTask)
);

// @route DELETE /:id
router.delete('/:id', asyncHandler(authenticateUser), asyncHandler(controller.deleteTask));
