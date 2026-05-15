FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY services/auth-service/ ./services/auth-service/
RUN npm install --workspace=@nexusflow/auth-service
RUN npx prisma generate --schema=services/auth-service/prisma/schema.prisma
RUN npm run build --workspace=@nexusflow/shared-types
RUN npm run build --workspace=@nexusflow/shared-utils
RUN npm run build --workspace=@nexusflow/auth-service

FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nexusflow && adduser -S nexusflow -u 1001
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist
COPY --from=builder /app/services/auth-service/prisma ./services/auth-service/prisma
COPY --from=builder /app/services/auth-service/package.json ./services/auth-service/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-utils/dist ./packages/shared-utils/dist
USER nexusflow
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
CMD ["node", "services/auth-service/dist/index.js"]
