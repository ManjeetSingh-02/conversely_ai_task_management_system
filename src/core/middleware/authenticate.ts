// internal-imports
import { env } from '../config/env.js';
import { prisma } from '../database/prisma/client.js';
import { verifyToken } from '../lib/jwt.js';
import { ErrorResponse } from '../response/error.js';

// type-imports
import type { IErrorResponse } from '../types/response.js';
import type { Request, Response, NextFunction } from 'express';

// function to authenticate user
export async function authenticateUser(
  request: Request,
  response: Response<IErrorResponse>,
  nextFunction: NextFunction
) {
  // get authorization header
  const authorizationHeaders = request.headers.authorization;
  if (!authorizationHeaders || !authorizationHeaders.startsWith('Bearer '))
    return response.status(401).json(
      new ErrorResponse({
        code: 'UNAUTHORIZED',
        message: 'Missing access token',
      })
    );

  // extract token from header
  const token = verifyToken({
    token: authorizationHeaders.split(' ')[1]!,
    secretKey: env.ACCESS_TOKEN_SECRET,
  });
  if (!token)
    return response.status(401).json(
      new ErrorResponse({
        code: 'UNAUTHORIZED',
        message: 'Invalid access token',
      })
    );

  // find user from token payload
  const existingUser = await prisma.users.findUnique({
    where: { id: token.id },
  });
  if (!existingUser)
    return response.status(401).json(
      new ErrorResponse({
        code: 'UNAUTHORIZED',
        message: 'Invalid access token',
      })
    );

  // attach user to request object
  request.user = {
    id: existingUser.id,
  };

  // forward request to next middleware or route handler
  nextFunction();
}
