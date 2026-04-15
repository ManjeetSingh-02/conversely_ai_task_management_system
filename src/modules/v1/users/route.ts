// internal-imports
import { controller } from './controller.js';
import { userCredentialsSchema } from './zod.js';
import { asyncHandler, authenticateUser, validateZodSchema } from '@/core/index.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route POST /
router.post('/', validateZodSchema(userCredentialsSchema), asyncHandler(controller.registerUser));

// @route GET /
router.get('/', asyncHandler(authenticateUser), asyncHandler(controller.getUser));

// @route POST /login
router.post('/login', validateZodSchema(userCredentialsSchema), asyncHandler(controller.loginUser));

// @route POST /logout
router.post('/logout', asyncHandler(authenticateUser), asyncHandler(controller.logoutUser));
