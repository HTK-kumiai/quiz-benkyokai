FROM node:20-alpine

WORKDIR /app

COPY public ./public
COPY server ./server

EXPOSE 3000

CMD ["node", "server/app-server.js"]

