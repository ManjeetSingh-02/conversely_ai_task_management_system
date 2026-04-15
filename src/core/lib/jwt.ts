// external-imports
import jwt from 'jsonwebtoken';

// types-imports
import type { SignOptions } from 'jsonwebtoken';

// function to generate a signed JWT token
export function generateSignedToken({
  payload,
  secretKey,
  options,
}: {
  payload: object;
  secretKey: string;
  options?: SignOptions;
}) {
  return jwt.sign(payload, secretKey, options);
}
