# Multi-stage build for security and efficiency
FROM node:20-alpine AS base

# Security: Run as non-root user
RUN addgroup -g 1001 -S mcp && adduser -S mcp -u 1001

# Install security tools
RUN apk add --no-cache \
    openssl \
    ca-certificates \
    dumb-init

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy MCP servers
COPY --chown=mcp:mcp mcp-servers/ ./mcp-servers/

# Runtime stage
FROM base AS runtime
WORKDIR /app

# Copy from builder
COPY --from=builder --chown=mcp:mcp /app/node_modules ./node_modules
COPY --from=builder --chown=mcp:mcp /app/mcp-servers ./mcp-servers

# Copy application files
COPY --chown=mcp:mcp src/ ./src/
COPY --chown=mcp:mcp config/ ./config/

# Security: Drop privileges
USER mcp

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the MCP server
CMD ["node", "src/index.js"]