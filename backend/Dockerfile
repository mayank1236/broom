# syntax=docker/dockerfile:1


ARG NODE_VERSION=22.4.1

# Build Stage
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
USER node
EXPOSE 5000
CMD ["node", "dist/index.js"]
