FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY services/api-gateway/ ./services/api-gateway/

# Install dependencies
RUN npm install --workspace=@nexusflow/api-gateway

# Build shared packages first, then the service
RUN npm run build --workspace=@nexusflow/shared-types
RUN npm run build --workspace=@nexusflow/shared-utils
RUN npm run build --workspace=@nexusflow/api-gateway

# ── Production Stage ─────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Security: run as non-root
RUN addgroup -g 1001 -S nexusflow && \
    adduser -S nexusflow -u 1001

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-gateway/dist ./services/api-gateway/dist
COPY --from=builder /app/services/api-gateway/package.json ./services/api-gateway/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-utils/dist ./packages/shared-utils/dist

USER nexusflow

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "services/api-gateway/dist/index.js"]
