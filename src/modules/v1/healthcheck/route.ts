// internal-imports
import { controller } from './controller.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route GET /
router.get('/', controller.checkHealth);
