# Stage 1: Build the application
# Use a Node image to run npm install and the build command
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first
COPY frontend/package.json ./

# The .env copy is correct since it's in the root
COPY .env ./.env 

# Install dependencies (only dev and production)
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend application files
COPY frontend/ . . 

# IMPORTANT: Run the Next.js build command
RUN npm run build

# Stage 2: Run the production application
# Use a smaller, secure base image for the final production image
FROM node:20-alpine AS runner

# Set environment variables for Next.js production server
ENV NODE_ENV production
# Set the port the Next.js server will listen on
ENV PORT 3000

# Copy necessary files from the builder stage
# Copy the built application files
COPY --from=builder /app/.next ./.next

# Copy static files, public files, and node_modules (production only)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env

# Set the host to listen on all interfaces
ENV HOSTNAME "0.0.0.0"

# Expose the port where Next.js will run
EXPOSE 3000

# Start the Next.js production server
# The 'start' script is defined by Next.js in the package.json
CMD ["npm", "start"]