import { env } from '@/env';
import { Argon2id } from 'oslo/password';

const secret = Buffer.from(env.PASSWORD_SECRET);
const argon = new Argon2id({
  secret
});

export const hash = (password: string) => argon.hash(password);

export const verify = async (hashed: string, password: string) =>
  argon.verify(hashed, password);
