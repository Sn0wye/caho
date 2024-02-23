import { Argon2id } from 'oslo/password';

const secret = Buffer.from('e0ad73dc-4c6e-47f6-84dd-e76c22872dc2');
const argon = new Argon2id({
  secret
});

export const hash = (password: string) => argon.hash(password);

export const verify = async (hashed: string, password: string) =>
  argon.verify(hashed, password);
