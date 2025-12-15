# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies
RUN npm install || yarn install

# Copy source code
COPY . .

# Build arguments for environment variables (injected at build time)
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_PUSHER_APP_KEY=
ARG VITE_PUSHER_APP_CLUSTER=eu
ARG VITE_PUSHER_BASE_URL=

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PUSHER_APP_KEY=$VITE_PUSHER_APP_KEY
ENV VITE_PUSHER_APP_CLUSTER=$VITE_PUSHER_APP_CLUSTER
ENV VITE_PUSHER_BASE_URL=$VITE_PUSHER_BASE_URL

# Build the application
RUN npm run build || yarn build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
