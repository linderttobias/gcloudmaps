FROM node:18.15.0-alpine AS ui-build

ENV REACT_APP_API_URL="https://gcloudmaps.com"
ENV REACT_APP_ENV = "PROD"

WORKDIR /usr/src/app
COPY . ./frontend/
RUN cd frontend  && npm install && npm run build


FROM node:18.15.0-alpine AS server-builds
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend/build ./build
RUN npm install -g serve

CMD ["serve", "-s", "build"]

EXPOSE 3000