FROM node:16-alpine3.16

WORKDIR /urs/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

USER node
