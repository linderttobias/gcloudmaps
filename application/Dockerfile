FROM node:18.15.0 AS ui-build
WORKDIR /usr/src/app
COPY frontend/ ./frontend/
RUN cd frontend  && npm install && npm run build

FROM node:18.15.0 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend/build ./frontend/build
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend/server.js ./backend/
COPY backend/data ./backend/data

EXPOSE 3001

CMD ["node", "./backend/server.js"]