FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Installation of production dependencies
COPY . .
RUN pnpm install --frozen-lockfile

RUN pnpm run build --filter=backend --filter=contracts --filter=schemas
EXPOSE 8080
CMD cd apps/backend && pnpm run start
