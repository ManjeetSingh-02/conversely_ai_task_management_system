// internal-imports
import { env } from '../../config/env.js';

// external-imports
import { Redis } from 'ioredis';

// create a new Redis client
export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});
