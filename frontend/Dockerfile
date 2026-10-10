# Stage 1: Build Angular Application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Copy built Angular files to Nginx html directory
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx configuration for Angular SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
