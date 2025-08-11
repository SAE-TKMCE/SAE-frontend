# Frontend Dockerfile - Multi-stage build for security
FROM node:20-alpine3.19 as builder

# Set environment variables
ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp/.npm

WORKDIR /app

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage with distroless image for maximum security
FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Copy a simple server script
COPY --from=builder /app/server.js /app/server.js

EXPOSE 3000

# Use non-root user (already set in distroless image)
USER nonroot:nonroot

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ["/nodejs/bin/node", "-e", "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]

CMD ["/nodejs/bin/node", "server.js"]
