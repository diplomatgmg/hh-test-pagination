FROM node:20.12.1-alpine

WORKDIR /opt/project/web

ENV PATH /opt/project/frontend/node_modules/.bin:$PATH
ENV APP_PG_URL postgresql://postgres:postgres@localhost:5432/test_pagination?sslmode=disable

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY public ./public
COPY src ./src

RUN npm install

EXPOSE 3001
