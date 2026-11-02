# Multi-stage Dockerfile for FleetMind Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm ci
RUN npx prisma generate

# Copy source code and compile TypeScript
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev
RUN npx prisma generate

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Create uploads folder
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "dist/server.js"]
