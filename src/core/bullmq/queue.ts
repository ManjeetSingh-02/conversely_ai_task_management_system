// internal-imports
import { redis } from '../database/redis/client.js';

// external-imports
import { Queue } from 'bullmq';

// create a new queue for sending reminder
export const queue = new Queue('reminder', { connection: redis });
