# Starts the stdio bridge with no environment variables required (Glama builds and scores this).
FROM node:22-alpine
WORKDIR /app
COPY package.json index.js ./
USER node
ENTRYPOINT ["node", "index.js"]
