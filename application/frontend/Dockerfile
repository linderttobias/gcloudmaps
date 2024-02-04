# Build stage
FROM node:18.15.0-alpine as build

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL="http://localhost:3001"
ENV REACT_APP_ENV = "PROD"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]