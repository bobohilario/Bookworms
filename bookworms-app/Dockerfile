FROM node:20-slim

# Build tools needed to compile better-sqlite3 native addon
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

# DATA_DIR is where the SQLite database lives.
# On Railway, create a persistent Volume mounted at /data and set DATA_DIR=/data
# in the service's environment variables — otherwise data is wiped on every deploy.
ENV DATA_DIR=/data

CMD ["npm", "start"]
