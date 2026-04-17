// external-imports
import mongoose from 'mongoose';
import z from 'zod';

// schema for name
const nameSchema = z
  .string()
  .trim()
  .min(3, { error: 'At least 3 characters long' })
  .regex(/^[A-Za-z0-9 -]+$/, { error: 'Only letters, numbers, spaces and hyphens allowed' })
  .max(30, { error: 'At most 30 characters long' });

// schema for mongooseObjectId
const mongooseObjectId = z
  .string()
  .trim()
  .refine(id => mongoose.Types.ObjectId.isValid(id), { error: 'Invalid ID' });

// schema for createTag
export const createTagSchema = z.object({
  body: z.object({
    name: nameSchema,
  }),
});

// schema for updateTag
export const updateTagSchema = z.object({
  params: z.object({
    id: mongooseObjectId,
  }),
  body: z.object({
    name: nameSchema,
  }),
});

// schema for deleteTag
export const deleteTagSchema = z.object({
  params: z.object({
    id: mongooseObjectId,
  }),
});
