// external-imports
import z from 'zod';

// schema for title
const titleSchema = z
  .string()
  .trim()
  .min(3, { error: 'At least 3 characters long' })
  .regex(/^[A-Za-z0-9 -]+$/, { error: 'Only letters, numbers, spaces and hyphens allowed' })
  .max(30, { error: 'At most 30 characters long' });

// schema for description
const descriptionSchema = z
  .string()
  .trim()
  .min(10, { error: 'At least 10 characters long' })
  .regex(/^[A-Za-z0-9 -]+$/, { error: 'Only letters, numbers, spaces and hyphens allowed' })
  .max(100, { error: 'At most 100 characters long' });

// schema for dueDate
const dueDateSchema = z.iso
  .datetime({
    offset: true,
    error:
      'Must be in ISO format with timezone [YYYY-MM-DDTHH:mm:ssZ] e.g. (2000-01-01T12:01:30-05:00)',
  })
  .transform(value => new Date(value))
  .refine(date => date.getTime() > Date.now(), { error: 'Must be in the future' });

// schema for createTask
export const createTaskSchema = z.object({
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
    dueDate: dueDateSchema,
  }),
});
