// type-imports
import type { IErrorResponse } from '../types/response.js';

// class to standardize API Error Response
export class ErrorResponse<T = unknown> extends Error implements IErrorResponse<T> {
  readonly success = false;
  readonly message: string;
  readonly code: string;
  readonly issues: T;

  // constructor to initialize ErrorResponse
  constructor({ message, code, issues }: { message: string; code: string; issues: T }) {
    // call the parent constructor with the error message
    super(message);

    // assign the properties to the instance
    this.message = message;
    this.code = code;
    this.issues = issues;

    // set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
