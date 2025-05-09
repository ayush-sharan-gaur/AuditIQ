# Dockerfile
FROM node:18-bullseye

# Install Chromium
RUN apt-get update && \
    apt-get install -y chromium

# Tell Puppeteer where to find it
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    # For headless mode
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package*.json ./
RUN npm install   # This will pull in puppeteer but skip its bundled Chromium
COPY . .

# Expose your port
EXPOSE 3001

CMD ["node", "backend/index.js"]
