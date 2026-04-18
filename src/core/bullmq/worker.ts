// internal-imports
import { env } from '../config/env.js';
import { redis } from '../database/redis/client.js';

// external-imports
import { Worker } from 'bullmq';

// create a new worker for sending reminders
export const worker = new Worker(
  'reminder',
  async job => {
    // log the message from the job data
    console.log(job.data.message);

    // retry the webhook call up to 3 times if it fails
    const retries = 3;
    const sendWebHook = async () => {
      await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: job.data.message }),
      });
    };
    const wait = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

    // retry the webhook call if it fails
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await sendWebHook();
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt < retries) await wait(5);
      }
    }
  },
  {
    connection: redis,
    autorun: true,
  }
);
