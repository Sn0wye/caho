import { app } from './app';
import { env } from './env';

async function run() {
  const url = await app.listen({
    host: '0.0.0.0',
    port: env.PORT
  });

  console.log(`Server is running on ${url}`);
}

run();
