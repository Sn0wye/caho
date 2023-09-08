FROM node:18-slim AS base
WORKDIR /app
COPY . .
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Installation of production dependencies
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build:packages

# Run using bun
FROM oven/bun:latest AS api
WORKDIR /app

COPY --from=build /app /app

EXPOSE 3333
CMD cd packages/api && bun run start
