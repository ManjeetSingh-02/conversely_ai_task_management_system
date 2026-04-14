// internal-imports
import { router } from './route.js';

// type-imports
import type { Application } from 'express';

// register module routes
export default function (application: Application) {
  application.use('/api/v1/healthcheck', router);
}
