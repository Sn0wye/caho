import { createId } from '@paralleldrive/cuid2';
import { auth } from '@/auth/lucia';
import { db } from '.';
import { keys, sessions, users } from './schema';

await db.delete(users).execute();
await db.delete(keys).execute();
await db.delete(sessions).execute();

const user = {
  id: createId(),
  username: 'Sn0wye',
  password: '12345678',
  email: 'gabriel@snowye.dev',
  name: 'Gabriel'
};

await auth.createUser({
  key: {
    providerId: 'username',
    providerUserId: user.id,
    password: user.password
  },
  attributes: {
    email: user.email,
    name: user.name,
    username: user.username
  }
});
