import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifySensible } from '@fastify/sensible';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyWebsocket } from '@fastify/websocket';
import {
  fastify,
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault
} from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod';
import { redis } from '@/db/redis';
import { env } from '@/env';
import { db } from './db';
import { authRoutes } from './http/routes/auth';
import { pingRoute } from './http/routes/ping';
import { roomRoutes } from './http/routes/room';
import { wsRoutes } from './http/routes/ws';
import { authPlugin } from './plugins/auth';

// import { csrfPlugin } from './plugins/csrf';
// import { fastifySocketIO } from './plugins/socketio';

export const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
}).withTypeProvider<TypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'CAHO API',
      description: 'Caho game API',
      version: '0.1.0'
    },
    servers: []
  },
  transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
});

export type App = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export type TypeProvider = ZodTypeProvider;

// decorators
app.decorate('db', db);
app.decorate('redis', redis);

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    redis: typeof redis;
  }
}

const corsOpts = {
  origin:
    env.NODE_ENV === 'production'
      ? 'https://caho.vercel.app'
      : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
};

// plugins
app.register(fastifyCors, corsOpts);
// app.register(fastifySocketIO, {
//   pingInterval: 1000,
//   cors: corsOpts
// });
app.register(fastifyWebsocket);
app.register(fastifySensible);
app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
  hook: 'onRequest',
  parseOptions: {}
});
// app.register(csrfPlugin, {
//   enabled: env.NODE_ENV === 'production'
// });
app.register(authPlugin);

// routes
app.register(authRoutes, {
  prefix: '/auth'
});
app.register(roomRoutes, {
  prefix: '/rooms'
});
app.register(pingRoute);
app.register(wsRoutes, {
  prefix: '/ws'
});
