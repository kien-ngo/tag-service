# Use the official Bun image
FROM oven/bun:1 as base

WORKDIR /usr/src/app

# Copy package.json and bun.lockb (if available)
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application (if there's a build step, otherwise this can be omitted)
RUN bun run check-types

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]