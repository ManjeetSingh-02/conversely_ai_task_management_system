// external-imports
import mongoose from 'mongoose';

// schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// index for createdBy field in schema
schema.index({ createdBy: 1 });

// unique index for name and createdBy fields in schema
schema.index({ name: 1, createdBy: 1 }, { unique: true });

// model
export const tags = mongoose.model('tags', schema);
