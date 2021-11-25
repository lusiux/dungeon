FROM node:16-buster-slim as build

WORKDIR /usr/src/app

ADD package-lock.json package.json ./
RUN npm ci

ADD . ./
RUN npm run build-backend

FROM node:16-buster-slim

WORKDIR /app
COPY --from=build /usr/src/app/build ./

CMD [ "node", "src/index.js" ]
