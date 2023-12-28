FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Stage 1: Build stage
FROM base AS builder
WORKDIR /app

# Copy only the package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/schemas/package.json ./packages/schemas/
COPY apps/backend/package.json ./apps/backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .

# Build the application
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm run build --filter=contracts --filter=schemas

# Stage 2: Production stage
FROM base AS production
WORKDIR /app

# COPY --from=builder /app ./

# Copy only the necessary files from the build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/packages/contracts ./packages/contracts
COPY --from=builder /app/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=builder /app/packages/schemas ./packages/schemas
COPY --from=builder /app/packages/schemas/node_modules ./packages/schemas/node_modules
COPY --from=builder /app/apps/backend ./apps/backend
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules

EXPOSE 8080
CMD cd apps/backend && pnpm run start
