// internal-imports
import { asyncHandler, authenticateUser, validateZodSchema } from '@/core/index.js';
import { controller } from './controller.js';

// external-imports
import { Router } from 'express';
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from './zod.js';

// router for module
export const router = Router();

// @route POST /
router.post(
  '/',
  asyncHandler(authenticateUser),
  validateZodSchema(createCategorySchema),
  asyncHandler(controller.createCategory)
);

// @route GET /
router.get('/', asyncHandler(authenticateUser), asyncHandler(controller.getCategories));

// @route PATCH /:id
router.patch(
  '/:id',
  asyncHandler(authenticateUser),
  validateZodSchema(updateCategorySchema),
  asyncHandler(controller.updateCategory)
);

// @route DELETE /:id
router.delete(
  '/:id',
  asyncHandler(authenticateUser),
  validateZodSchema(deleteCategorySchema),
  asyncHandler(controller.deleteCategory)
);
