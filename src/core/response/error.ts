// type-imports
import type { IErrorResponse } from '../types/response.js';

// class to standardize API Error Response
export class ErrorResponse<I = undefined> extends Error implements IErrorResponse<I> {
  readonly success = false;
  readonly message: string;
  readonly code: string;
  readonly issues?: I;

  // constructor to initialize ErrorResponse
  constructor({ message, code, issues }: { message: string; code: string; issues?: I }) {
    // call the parent constructor with the error message
    super(message);

    // assign the properties to the instance
    this.message = message;
    this.code = code;
    if (issues !== undefined) this.issues = issues;

    // set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
