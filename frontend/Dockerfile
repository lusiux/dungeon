FROM node:16-buster-slim as build

WORKDIR /usr/src/app

ADD package-lock.json package.json ./
RUN npm ci

ADD . ./
RUN NODE_ENV=production npm run build

FROM nginx:1.20-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/backend-proxy.conf

WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/build ./
