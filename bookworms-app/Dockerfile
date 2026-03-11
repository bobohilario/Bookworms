FROM node:20-slim

# Build tools needed to compile better-sqlite3 native addon
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set DATA_DIR before the build so any build-time db access goes to the right place
ENV NODE_ENV=production
ENV DATA_DIR=/data

# Ensure the data directory exists in the image as a fallback
RUN mkdir -p /data

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000

# Declare /data as a persistent volume mount point.
# On Railway: go to your service → Volumes → add a volume mounted at /data
# Without this, the database is wiped on every deployment.
VOLUME ["/data"]

CMD ["npm", "start"]
