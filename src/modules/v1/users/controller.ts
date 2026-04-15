// internal-imports
import { ErrorResponse, prisma, SuccessResponse } from '@/core/index.js';

// external-imports
import bcrypt from 'bcryptjs';

// type-imports
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller POST /
  createUser: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse<null>>
  ) => {
    // check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: request.body.email },
    });
    if (existingUser)
      return response.status(400).json(
        new ErrorResponse({
          code: 'USER_ALREADY_EXISTS',
          message: 'A user with this email already exists.',
          issues: null,
        })
      );

    // create new user in database
    const newUser = await prisma.users.create({
      data: {
        email: request.body.email,
        password: await bcrypt.hash(request.body.password, 10),
      },
    });

    // return success response with new user data
    return response.status(201).json(
      new SuccessResponse({
        message: 'User registration successful',
        data: {
          id: newUser.id,
          email: newUser.email,
        },
      })
    );
  },

  // @controller GET /
  getUserProfile: () => {},

  // @controller POST /login
  loginUser: () => {},

  // @controller POST /logout
  logoutUser: () => {},
};
