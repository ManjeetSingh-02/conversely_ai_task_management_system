// internal-imports
import {
  APP_CONFIG,
  compareHashedData,
  env,
  ErrorResponse,
  generateSignedToken,
  hashData,
  prisma,
  SuccessResponse,
} from '@/core/index.js';

// type-imports
import type { IErrorResponse, ISuccessResponse } from '@/core/index.js';
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller POST /
  registerUser: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: request.body.email },
    });
    if (existingUser)
      return response.status(409).json(
        new ErrorResponse({
          code: 'USER_ALREADY_EXISTS',
          message: 'A user with this email already exists',
        })
      );

    // create new user in database
    const newUser = await prisma.users.create({
      data: {
        email: request.body.email,
        password: await hashData(request.body.password, 10),
      },
    });

    // return success response with new user data
    return response.status(201).json(
      new SuccessResponse({
        message: 'User registered successfully',
        data: {
          id: newUser.id,
          email: newUser.email,
        },
      })
    );
  },

  // @controller GET /profile
  getUser: async (request: Request, response: Response<ISuccessResponse<object>>) => {
    // get user details from database
    const existingUser = await prisma.users.findUnique({
      where: { id: request.user!.id },
      omit: { password: true, refreshToken: true },
    });

    // return success response with user data
    return response.status(200).json(
      new SuccessResponse({
        message: 'User profile fetched successfully',
        data: existingUser!,
      })
    );
  },

  // @controller POST /login
  loginUser: async (
    request: Request,
    response: Response<ISuccessResponse<object> | IErrorResponse>
  ) => {
    // check if login credentials are valid
    const existingUser = await prisma.users.findUnique({
      where: { email: request.body.email },
    });
    if (!existingUser || !(await compareHashedData(request.body.password, existingUser.password)))
      return response.status(401).json(
        new ErrorResponse({
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        })
      );

    // generate access and refresh tokens
    const accessToken = generateSignedToken({
      payload: { id: existingUser.id },
      secretKey: env.ACCESS_TOKEN_SECRET,
      options: { expiresIn: env.ACCESS_TOKEN_LIFETIME / 1000 },
    });
    const refreshToken = generateSignedToken({
      payload: { id: existingUser.id },
      secretKey: env.REFRESH_TOKEN_SECRET,
      options: { expiresIn: env.REFRESH_TOKEN_LIFETIME / 1000 },
    });

    // store refresh token in database
    await prisma.users.update({
      where: { id: existingUser.id },
      data: { refreshToken },
    });

    // return success response with access token and set refreshToken in httpOnly cookie
    return response
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === APP_CONFIG.NODE_ENVS.PRODUCTION,
        signed: true,
        sameSite: env.NODE_ENV === APP_CONFIG.NODE_ENVS.PRODUCTION ? 'none' : 'lax',
        maxAge: env.REFRESH_TOKEN_LIFETIME,
      })
      .json(
        new SuccessResponse({
          message: 'User logged in successfully',
          data: { accessToken },
        })
      );
  },

  // @controller POST /logout
  logoutUser: async (request: Request, response: Response<ISuccessResponse>) => {
    // clear refresh token from database
    await prisma.users.update({
      where: { id: request.user!.id },
      data: { refreshToken: null },
    });

    // return success response and clear refreshToken cookie
    return response
      .status(200)
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === APP_CONFIG.NODE_ENVS.PRODUCTION,
        signed: true,
        sameSite: env.NODE_ENV === APP_CONFIG.NODE_ENVS.PRODUCTION ? 'none' : 'lax',
        maxAge: env.REFRESH_TOKEN_LIFETIME,
      })
      .json(
        new SuccessResponse({
          message: 'User logged out successfully',
        })
      );
  },
};
