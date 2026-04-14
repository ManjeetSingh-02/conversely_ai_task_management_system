// internal-imports
import { SuccessResponse } from '@/core/index.js';

// type-imports
import type { ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller GET /
  checkHealth: (_request: Request, response: Response<ISuccessResponse<null>>) => {
    return response.status(200).json(
      new SuccessResponse({
        message: 'Service is healthy',
        data: null,
      })
    );
  },
};
