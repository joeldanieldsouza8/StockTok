FROM node:20-alpine AS base

# -----------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------
FROM base AS deps
WORKDIR /app

# Docker looks for these IN the 'frontend' folder because of your compose context
COPY package.json package-lock.json ./

# This will now succeed because the files are in the same directory as the command
RUN npm ci

# -----------------------------------------
# Stage 2: Build the application
# -----------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# This copies everything else FROM frontend/ INTO the container
COPY . .

ARG BACKEND_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL

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

# server.js is created by Next.js standalone mode
CMD ["node", "server.js"]