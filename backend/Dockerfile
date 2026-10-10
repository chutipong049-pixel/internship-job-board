FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy dependency definitions
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client and build NestJS
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Wait for DB, push schema, seed sample data, and start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run prisma:seed && npm run start:prod"]
