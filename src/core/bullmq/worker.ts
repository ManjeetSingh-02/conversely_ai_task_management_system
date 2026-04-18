// internal-imports
import { logger } from '../logger/winston.js';
import { redis } from '../database/redis/client.js';

// external-imports
import { Worker } from 'bullmq';

// create a new worker for sending reminders
export const worker = new Worker(
  'reminder',
  async job => logger.info(`Task: ${job.id} due in 1 hour`),
  { connection: redis }
);
