// type-imports
import type { ISuccessResponse } from '../types/response.js';

// class to standardize API Success Response
export class SuccessResponse<T = unknown> implements ISuccessResponse<T> {
  readonly success = true;
  readonly message: string;
  readonly data: T;

  // constructor to initialize ErrorResponse
  constructor({ message, data }: { message: string; data: T }) {
    // assign the properties to the instance
    this.message = message;
    this.data = data;
  }
}
