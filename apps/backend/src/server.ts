import { app } from './app';
import { env } from './env';

app
  .listen({
    port: env.PORT
  })
  .then(url => {
    console.log(`Server is running on ${url}`);
  });
