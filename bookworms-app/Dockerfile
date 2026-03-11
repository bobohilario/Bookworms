FROM node:20-slim

# Build tools needed to compile better-sqlite3 native addon
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV DATA_DIR=/data

# Ensure the data directory exists in the image as a fallback
RUN mkdir -p /data

COPY package*.json ./
# Install all deps (including devDeps like TypeScript) for the build step
RUN npm ci
COPY . .
RUN npm run build

# Switch to production after build so runtime skips devDeps
ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "next start -p ${PORT:-3000}"]
