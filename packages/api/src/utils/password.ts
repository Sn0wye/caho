import { randomBytes, scryptSync } from 'crypto';

const encryptPassword = (password: string, salt: string) => {
  return scryptSync(password, salt, 32).toString('hex');
};

export const encrypt = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  return encryptPassword(password, salt) + salt;
};

export const compare = (hashed: string, password: string): boolean => {
  const salt = hashed.slice(64);
  const originalPassHash = hashed.slice(0, 64);
  const currentPassHash = encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
};
