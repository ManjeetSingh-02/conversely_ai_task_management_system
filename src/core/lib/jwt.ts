// external-imports
import jwt from 'jsonwebtoken';

// types-imports
import type { SignOptions } from 'jsonwebtoken';

// type definition for access token payload
type AccessTokenPayload = {
  id: string;
};

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

// function to verify a JWT token
export function verifyToken({
  token,
  secretKey,
}: {
  token: string;
  secretKey: string;
}): AccessTokenPayload | null {
  try {
    return jwt.verify(token, secretKey) as AccessTokenPayload;
  } catch {
    return null;
  }
}
