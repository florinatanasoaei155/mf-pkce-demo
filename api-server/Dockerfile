# Use a lightweight Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the essential files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]