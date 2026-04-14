// type-imports
import type { Request, Response, NextFunction } from 'express';

// type definition for the controller that will be wrapped by the async-handler
type Controller<T = unknown> = (
  request: Request,
  response: Response<T>,
  nextFunction: NextFunction
) => unknown | Promise<unknown>;

// function to wrap controllers inside async-handler
export default function <T = unknown>(controller: Controller<T>) {
  return function (request: Request, response: Response<T>, nextFunction: NextFunction) {
    return Promise.resolve(controller(request, response, nextFunction)).catch(nextFunction);
  };
}
