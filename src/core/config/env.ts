// internal-imports
import { APP_CONFIG } from './constants.js';

// external-imports
import 'dotenv/config';
import z from 'zod';

// zod schema for environment variables
const envSchema = z.object({
  ORIGIN_URL: z.url({ error: 'ORIGIN_URL must be a valid URL' }),
  PORT: z.coerce.number().int().positive(),
  MONGO_DB_URI: z.url({ error: 'MONGO_DB_URI must be a valid URL' }),
  POSTGRES_DB_URI: z.url({ error: 'POSTGRES_DB_URI must be a valid URL' }),
  NODE_ENV: z.enum(Object.values(APP_CONFIG.NODE_ENVS)),
  COOKIE_SECRET: z.string().min(32, { error: 'COOKIE_SECRET must be atleast 32 chars' }),
});

// function to validate environment variables
function validateEnv() {
  try {
    // parse environment variables
    return envSchema.parse(process.env);
  } catch (error: unknown) {
    // if zod error, format and throw a new error with all issues
    if (error instanceof z.ZodError)
      throw new Error(
        error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n'),
        { cause: error }
      );

    // if it's not a zod error, rethrow it
    throw error;
  }
}

// export the validated environment variables
export const env = validateEnv();
