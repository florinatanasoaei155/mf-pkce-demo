# Use Node.js 20 base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml (instead of package-lock.json)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose API port
EXPOSE 9000

# Start the Identity Server
CMD ["node", "server.js"]