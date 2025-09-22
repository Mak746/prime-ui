#-------------------
# Development
#-------------------
FROM node:20-alpine as development

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY  package*.json ./

RUN npm ci --loglevel verbose --fetch-timeout=600000

COPY  . .

#-------------------
# Production Build
#-------------------
FROM node:20-alpine AS prodBuild

RUN apk update && apk add curl bash g++ make && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY package*.json ./

# copy node_modules
COPY --from=development /usr/src/app/node_modules ./node_modules

# copy source files
COPY . .

# build application
RUN npm run build

# remove development dependencies
RUN npm prune --omit=dev

# run node prune
RUN /usr/local/bin/node-prune

# remove unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map

COPY ./resources ./resources

#-------------------
# Production
#-------------------
FROM node:20-alpine as production

WORKDIR /usr/src/app

ENV NODE_ENV production

# copy from production build image
COPY --from=prodBuild /usr/src/app/dist ./dist
COPY --from=prodBuild /usr/src/app/env ./env
COPY --from=prodBuild /usr/src/app/node_modules ./node_modules

FROM production as api

CMD [ "node", "./dist/apps/api/main.js" ]

FROM production as chat

CMD ["node", "./dist/apps/chats/main.js"]

FROM production as worker

CMD [ "node", "./dist/apps/job/main.js" ]

