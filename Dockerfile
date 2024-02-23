FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm
RUN npm i -g turbo

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

RUN pnpm run build --filter=backend

# Stage 3: Production stage
FROM base AS runner
WORKDIR /app

COPY --from=installer /app ./

EXPOSE 8080
CMD cd apps/backend && pnpm run start
