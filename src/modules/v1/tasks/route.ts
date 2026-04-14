// internal-imports
import { controller } from './controller.js';

// external-imports
import { Router } from 'express';

// router for module
export const router = Router();

// @route POST /
router.post('/', controller.createTask);

// @route GET /
router.get('/', controller.getTasks);

// @route GET /:id
router.get('/:id', controller.getTask);

// @route PATCH /:id
router.patch('/:id', controller.updateTask);

// @route DELETE /:id
router.delete('/:id', controller.deleteTask);
