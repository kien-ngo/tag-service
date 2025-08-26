# Base image with Bun
FROM oven/bun:latest as base
WORKDIR /usr/src/app

# Install dependencies separately (better layer caching)
FROM base as deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Only copy source after deps
FROM base as app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Expose and run
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
