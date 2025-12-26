import bcrypt from 'bcryptjs';
import { V4 } from 'paseto';
import { Buffer } from 'node:buffer';
import { createSecretKey } from 'node:crypto';

// 1. Password Hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 2. Password Verification
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// 3. Generate PASETO Token (V4 Local)
export const createToken = async (payload: any, secretKey: string) => {
  // Convert Hex String -> Buffer -> KeyObject
  const keyBuffer = Buffer.from(secretKey, 'hex');
  const keyObject = createSecretKey(keyBuffer);
  
  return V4.encrypt(payload, keyObject, {
    expiresIn: '2h'
  });
};

// 4. Verify PASETO Token
export const verifyToken = async (token: string, secretKey: string) => {
  const keyBuffer = Buffer.from(secretKey, 'hex');
  const keyObject = createSecretKey(keyBuffer);
  
  return V4.decrypt(token, keyObject);
};