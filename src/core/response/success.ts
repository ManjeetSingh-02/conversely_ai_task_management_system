// type-imports
import type { ISuccessResponse } from '../types/response.js';

// class to standardize API Success Response
export class SuccessResponse<D = undefined, M = undefined> implements ISuccessResponse<D, M> {
  readonly success = true;
  readonly message: string;
  readonly data?: D;
  readonly meta?: M;

  // constructor to initialize ErrorResponse
  constructor({ message, data, meta }: { message: string; data?: D; meta?: M }) {
    // assign the properties to the instance
    this.message = message;
    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }
}
