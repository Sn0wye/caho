import { app } from './app';
import { env } from './env';

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT
  })
  .then(url => {
    console.log(`Server is running on ${url}`);
  });
