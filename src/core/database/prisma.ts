// internal-imports
import { env } from '../config/env.js';
import { PrismaClient } from './generated/prisma/client.js';

// external-imports
import { PrismaPg } from '@prisma/adapter-pg';

// create a new prisma client instance
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.POSTGRES_DB_URI }),
});
