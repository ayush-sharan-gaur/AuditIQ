# ─────────────────────────────────────────────────────────────────────────────
# ─── 1) Use an official Node image (with Debian) that Puppeteer supports ──────
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-slim

# ────────────────────────────────────────────────
# 2) Install Chromium and its libs for Puppeteer
#    (matches Puppeteer’s Docker guide)
# ────────────────────────────────────────────────
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
      fonts-liberation \
      libasound2 \
      libatk1.0-0 \
      libc6 \
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

# ─────────────────────────────────────────────────────────────────────────────
# 3) Switch into your backend working directory inside the image
# ─────────────────────────────────────────────────────────────────────────────
WORKDIR /app

# ─────────────────────────────────────────────────────────────────────────────
# 4) Copy only the backend's package.json & package-lock.json, then install
# ─────────────────────────────────────────────────────────────────────────────
COPY backend/package*.json ./
RUN npm install --production

# ─────────────────────────────────────────────────────────────────────────────
# 5) Now copy the rest of your backend code
# ─────────────────────────────────────────────────────────────────────────────
COPY backend/ ./

# ─────────────────────────────────────────────────────────────────────────────
# 6) (Optional) set your default env-vars; Render will override PORT for you
# ─────────────────────────────────────────────────────────────────────────────
ENV NODE_ENV=production
EXPOSE 3001

# ─────────────────────────────────────────────────────────────────────────────
# 7) Finally, launch your server
# ─────────────────────────────────────────────────────────────────────────────
CMD ["npm", "start"]
