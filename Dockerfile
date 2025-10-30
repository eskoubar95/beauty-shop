# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from beauty-shop subdirectory
COPY beauty-shop/package.json beauty-shop/yarn.lock beauty-shop/.yarnrc.yml ./
COPY beauty-shop/.yarn ./.yarn

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code from beauty-shop subdirectory
COPY beauty-shop/ .

# Build MedusaJS (frontend + backend)
RUN NODE_OPTIONS=--max-old-space-size=2048 yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files from beauty-shop subdirectory
COPY beauty-shop/package.json beauty-shop/yarn.lock beauty-shop/.yarnrc.yml ./
COPY beauty-shop/.yarn ./.yarn

# Install production dependencies only
RUN yarn workspaces focus --production

# Copy built artifacts from builder stage
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/dist ./dist

# Copy medusa config from beauty-shop subdirectory
COPY beauty-shop/medusa-config.ts ./

# Expose port (Railway sets PORT env var)
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 9000) + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start server
CMD ["yarn", "start"]

