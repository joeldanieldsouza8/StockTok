FROM node:20-alpine AS base

# -----------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------
FROM base AS deps
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# -----------------------------------------
# Stage 2: Build the application
# -----------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .

# BACKEND_API_URL* vars must be set at build time
ARG BACKEND_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL

# Build Next.js in standalone mode
RUN npm run build

# -----------------------------------------
# Stage 3: Production image
# -----------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]