import { redis } from '@/db/redis';
import { env } from '@/env';
import { fastifyCookie } from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import { fastifySensible } from '@fastify/sensible';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyWebsocket } from '@fastify/websocket';
import {
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
  fastify
} from 'fastify';
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';
import { db } from './db';
import { fastifyErrorHandler } from './http/error-handler';
import { authRoutes } from './http/routes/auth';
import { pingRoute } from './http/routes/ping';
import { roomRoutes } from './http/routes/room';
import { wsRoutes } from './http/routes/ws';
import { Pubsub } from './lib/pub-sub';
import { authPlugin } from './plugins/auth';
import { checkRoutes } from './http/routes/checks';

// import { csrfPlugin } from './plugins/csrf';
// import { fastifySocketIO } from './plugins/socketio';

export type App = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export const app = fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger'
    }
  }
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'CAHO API',
      description: 'Caho game API',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          description: 'Session cookie (auto-set)',
          in: 'cookie',
          name: 'auth_session'
        },
        bearerAuth: {
          type: 'http',
          description: 'Bearer token',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  transform: jsonSchemaTransform
});

app.setErrorHandler(fastifyErrorHandler);

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
});

// decorators
app.decorate('db', db);
app.decorate('redis', redis);
app.decorate('pubsub', new Pubsub(redis));

// plugins
app.register(fastifyCors, {
  origin:
    env.NODE_ENV === 'production'
      ? ['https://caho.com.br']
      : ['http://localhost:3000'],
  credentials: true
});
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
app.register(checkRoutes);
app.register(pingRoute);
app.register(wsRoutes, {
  prefix: '/ws'
});
