FROM node:22-slim AS base
WORKDIR /app

# Install deps
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3333
CMD ["node", "build/server.js"]
