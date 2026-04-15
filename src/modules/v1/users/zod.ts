// external-imports
import z from 'zod';

// schema for userCredentials
export const userCredentialsSchema = z.object({
  body: z.object({
    email: z.email({ error: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { error: 'At least 8 characters long' })
      .regex(/[a-z]/, { error: 'Contain at least one lowercase letter' })
      .regex(/[A-Z]/, { error: 'Contain at least one uppercase letter' })
      .regex(/[0-9]/, { error: 'Contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, { error: 'Contain at least one special character' })
      .max(128, { error: 'At most 128 characters long' }),
  }),
});
