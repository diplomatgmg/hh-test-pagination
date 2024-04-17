ARG NODE_VERSION=20.12.1

FROM node:${NODE_VERSION}-alpine

# Use development node environment by default.

WORKDIR /app/web

COPY . .
RUN npm install


EXPOSE 3001
