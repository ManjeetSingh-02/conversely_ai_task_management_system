// external-imports
import bcrypt from 'bcryptjs';

// function to hash data using bcrypt
export async function hashData(data: string, saltRounds: number) {
  return await bcrypt.hash(data, saltRounds);
}

// function to compare data with hashed value using bcrypt
export async function compareHashedData(data: string, hashedValue: string) {
  return await bcrypt.compare(data, hashedValue);
}
