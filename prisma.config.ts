// internal-imports
import { env } from './src/core';

// external-imports
import { defineConfig } from 'prisma/config';

// prisma configuration
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env.POSTGRES_DB_URI,
  },
});
