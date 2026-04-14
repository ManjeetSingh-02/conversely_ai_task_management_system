// internal-imports
import { env } from './env.js';

// type-imports
import type { CorsOptions } from 'cors';

// CORS configuration options
export const corsConfig: CorsOptions = {
  origin: env.ORIGIN_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Set-Cookie', '*'],
};
