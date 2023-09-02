import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
import { db } from '.';
import { encrypt } from '../utils/password';
import { tokens, users } from './schema';

db.delete(tokens).run();
db.delete(users).run();

Array.from({ length: 10 }).forEach((_, i) => {
  const name = i === 1 ? 'Sn0wye' : faker.person.firstName();
  const password = i === 1 ? encrypt('12345') : encrypt(createId());

  db.insert(users)
    .values({
      id: createId(),
      name,
      password
    })
    .run();
});
