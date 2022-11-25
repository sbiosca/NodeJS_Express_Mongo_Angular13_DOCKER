FROM node:19-alpine as dependencies
WORKDIR /rest
COPY ./package.json ./package.json
RUN ["npm", "install"]

FROM node:19-alpine
WORKDIR /rest
RUN apk update && apk add bash
COPY ./package.json ./package.json
COPY ./rest ./rest
COPY ./index.js ./index.js
COPY --from=dependencies /rest/node_modules ./node_modules
EXPOSE 3000
