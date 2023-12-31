import { db } from '.';
import { auth } from '../auth/lucia';
import { keys, sessions, users } from './schema';

async function main() {
  await db.delete(users).execute();
  await db.delete(keys).execute();
  await db.delete(sessions).execute();
  const user = {
    username: 'Sn0wye',
    password: '12345678',
    email: 'gabriel@snowye.dev',
    name: 'Gabriel'
  };
  await auth.createUser({
    key: {
      providerId: 'username',
      providerUserId: user.username,
      password: user.password
    },
    attributes: {
      email: user.email,
      name: user.name,
      username: user.username
    }
  });
}
main()
  .then(() => console.log('Migration ran successfully!'))
  .catch(console.error);
