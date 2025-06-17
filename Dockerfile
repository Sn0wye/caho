# check=skip=SecretsUsedInArgOrEnv
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
RUN npm i -g turbo@2.0.1

# Stage 1: Prebuild stage
FROM base AS builder
WORKDIR /app

COPY . .
RUN turbo prune @caho/backend --docker

# Stage 2: Build the application
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full .

# Build the application
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm run build --filter=@caho/backend

# Stage 3: Production stage
FROM base AS runner
WORKDIR /app
EXPOSE 8080
CMD ["sh", "-c", "cd apps/backend && pnpm run start"]

COPY --from=installer /app ./
