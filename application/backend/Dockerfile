FROM node:18.15.0-alpine AS server-build
WORKDIR /app
COPY . .
RUN npm install

CMD ["node", "server.js"]

EXPOSE 3001