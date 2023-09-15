FROM node:18-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Installation of production dependencies
FROM base AS build
COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build --filter=contracts --filter=schemas

# Run using bun
FROM oven/bun:latest AS api
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/backend ./apps/backend
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json

EXPOSE 3333
CMD cd apps/backend && bun run start
