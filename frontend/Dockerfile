# Multi-stage Dockerfile for FleetMind Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./
RUN npm ci

# Copy sources and build production bundle
COPY . .
RUN npm run build

# Production Web Server Stage (Nginx Alpine)
FROM nginx:alpine AS runner

# Remove default nginx site
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
