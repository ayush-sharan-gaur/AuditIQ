# 1) Start from an official Node image that Puppeteer supports
FROM node:18-bullseye-slim

# 2) Install OS libs + Debian’s chromium package
#    so chrome-launcher/puppeteer can find a real headless Chrome
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       chromium \
       ca-certificates \
       fonts-liberation \
       libasound2 \
       libatk1.0-0 \
       libcairo2 \
       libcups2 \
       libdbus-1-3 \
       libexpat1 \
       libfontconfig1 \
       libgcc1 \
       libgconf-2-4 \
       libgdk-pixbuf2.0-0 \
       libglib2.0-0 \
       libgtk-3-0 \
       libnspr4 \
       libpango-1.0-0 \
       libstdc++6 \
       libx11-6 \
       libx11-xcb1 \
       libxcb1 \
       libxcomposite1 \
       libxcursor1 \
       libxdamage1 \
       libxext6 \
       libxfixes3 \
       libxi6 \
       libxrandr2 \
       libxrender1 \
       libxss1 \
       libxtst6 \
       xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# 3) Set working directory for your backend
WORKDIR /app

# 4) Copy just the backend’s package files & install deps
COPY backend/package*.json ./
RUN npm ci --only=production

# 5) Copy the rest of your backend source
COPY backend/ ./

# 6) Tell Node to use the port Render provides (defaults to 10000 in Docker)
ENV PORT=${PORT:-10000}
EXPOSE $PORT

# 7) Launch your server
CMD ["npm", "start"]
