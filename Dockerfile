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
# RUN bun run check-types

# Set default port value that can be overridden
ARG SERVER_PORT=4444
ENV SERVER_PORT=${SERVER_PORT}

# Expose the port the app runs on
EXPOSE ${SERVER_PORT}

# Start the application
CMD ["bun", "run", "src/index.ts"]