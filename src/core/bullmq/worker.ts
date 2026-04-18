// internal-imports
import { redis } from '../database/redis/client.js';

// external-imports
import { Worker } from 'bullmq';

// create a new worker for sending reminders
export const worker = new Worker('reminder', async job => console.log(job.data.message), {
  connection: redis,
  autorun: true,
});
