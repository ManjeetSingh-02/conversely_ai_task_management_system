// type-imports
import type { Request, Response, NextFunction } from 'express';

// type definition for the controller that will be wrapped by the async-handler
type Controller<R extends Request = Request, T = unknown> = (
  request: R,
  response: Response<T>,
  nextFunction: NextFunction
) => unknown | Promise<unknown>;

// function to wrap controllers inside async-handler
export function asyncHandler<R extends Request = Request, T = unknown>(
  controller: Controller<R, T>
) {
  return function (request: R, response: Response<T>, nextFunction: NextFunction) {
    return Promise.resolve(controller(request, response, nextFunction)).catch(nextFunction);
  };
}
