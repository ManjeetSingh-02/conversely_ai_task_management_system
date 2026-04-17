// internal-imports
import { asyncHandler, authenticateUser, validateZodSchema } from '@/core/index.js';
import { controller } from './controller.js';

// external-imports
import { Router } from 'express';
import { createTagSchema, deleteTagSchema, updateTagSchema } from './zod.js';

// router for module
export const router = Router();

// @route POST /
router.post(
  '/',
  asyncHandler(authenticateUser),
  validateZodSchema(createTagSchema),
  asyncHandler(controller.createTag)
);

// @route GET /
router.get('/', asyncHandler(authenticateUser), asyncHandler(controller.getTags));

// @route PATCH /:id
router.patch(
  '/:id',
  asyncHandler(authenticateUser),
  validateZodSchema(updateTagSchema),
  asyncHandler(controller.updateTag)
);

// @route DELETE /:id
router.delete(
  '/:id',
  asyncHandler(authenticateUser),
  validateZodSchema(deleteTagSchema),
  asyncHandler(controller.deleteTag)
);
