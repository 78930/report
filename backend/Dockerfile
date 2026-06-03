FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . ./

# Create uploads dir
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
