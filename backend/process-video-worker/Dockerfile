FROM node:21-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src

COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "src/main.js"]