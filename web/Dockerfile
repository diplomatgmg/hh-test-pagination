FROM node:20.12.1-alpine

WORKDIR /opt/project/web

ENV PATH /opt/project/web/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY public ./public
COPY src ./src

RUN npm install

EXPOSE 3001
