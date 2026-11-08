FROM node:alpine

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

ENTRYPOINT [ "npm","start" ]