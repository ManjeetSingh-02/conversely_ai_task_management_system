// internal-imports
import { controller } from './controller.js';
import { createUserSchema } from './zod.js';
import { asyncHandler, validateZodSchema } from '@/core/index.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route POST /
router.post('/', validateZodSchema(createUserSchema), asyncHandler(controller.createUser));

// @route GET /
router.get('/', controller.getUserProfile);

// @route POST /login
router.post('/', controller.loginUser);

// @route POST /logout
router.post('/', controller.logoutUser);
