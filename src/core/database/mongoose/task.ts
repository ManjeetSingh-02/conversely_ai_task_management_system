// internal-imports
import { APP_CONFIG } from '../../config/constants.js';

// external-imports
import mongoose from 'mongoose';

// schema
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    description: {
      type: String,
      trim: true,
      minLength: 10,
      maxLength: 100,
    },
    status: {
      type: String,
      enum: Object.values(APP_CONFIG.TASK_CONFIG.STATUS),
      default: APP_CONFIG.TASK_CONFIG.STATUS.PENDING,
    },
    createdBy: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// index for createdBy field in schema
schema.index({ createdBy: 1 });

// unique index for title and createdBy fields in schema
schema.index({ title: 1, createdBy: 1 }, { unique: true });

// model
export const tasks = mongoose.model('tasks', schema);
