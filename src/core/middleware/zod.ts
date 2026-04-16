// internal-imports
import { ErrorResponse } from '../response/error.js';

// type-imports
import type { ZodObject } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// function for validating request body using zod schema
export function validateZodSchema(schema: ZodObject) {
  return function (request: Request, response: Response, nextFunction: NextFunction) {
    // validate request against the provided schema
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    // if validation fails
    if (!result.success)
      return response.status(400).json(
        new ErrorResponse<Array<string>>({
          message: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          issues: result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`),
        })
      );

    // add validated data to request.validated
    request.validated = result.data;

    // forward request to next middleware
    nextFunction();
  };
}
