// internal-imports
import { APP_CONFIG } from '@/core/index.js';

// external-imports
import mongoose from 'mongoose';
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

// schema for mongooseObjectId
const mongooseObjectId = z
  .string()
  .trim()
  .refine(id => mongoose.Types.ObjectId.isValid(id), { error: 'Invalid ID' });

// schema for tags
const tagsSchema = z
  .array(mongooseObjectId)
  .min(1, { error: 'At least 1 tag is required' })
  .max(5, { error: 'At most 5 tags are allowed' })
  .optional();

// schema for createTask
export const createTaskSchema = z.object({
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
    dueDate: dueDateSchema,
    categoryId: mongooseObjectId.optional(),
    tagIds: tagsSchema,
  }),
});

// schema for getTasks
export const getTasksSchema = z.object({
  query: z.object({
    category: mongooseObjectId.optional(),
    tags: z.array(mongooseObjectId).optional(),
  }),
});

// schema for getTask and deleteTask
export const getTaskAndDeleteTaskSchema = z.object({
  params: z.object({
    id: mongooseObjectId,
  }),
});

// schema for updateTask
export const updateTaskSchema = z.object({
  params: z.object({
    id: mongooseObjectId,
  }),
  body: z
    .object({
      description: descriptionSchema.optional(),
      status: z.enum(Object.values(APP_CONFIG.TASK_CONFIG.STATUS)).optional(),
      dueDate: dueDateSchema.optional(),
      categoryId: mongooseObjectId.optional(),
      tagIds: tagsSchema,
    })
    .refine(data => Object.keys(data).length > 0, { error: 'At least one field must be provided' }),
});
