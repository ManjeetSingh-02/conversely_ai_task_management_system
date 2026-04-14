// internal-imports
import { controller } from './controller.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route POST /
router.post('/', controller.createUser);

// @route GET /
router.get('/', controller.getUserProfile);

// @route POST /login
router.post('/', controller.loginUser);

// @route POST /logout
router.post('/', controller.logoutUser);
