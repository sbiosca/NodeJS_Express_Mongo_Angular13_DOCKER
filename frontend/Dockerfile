FROM node:19-alpine as dependencies
WORKDIR /app
COPY ./package.json .
RUN ["npm", "install", "--force"]

FROM node:19-alpine
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 4200 49153
CMD ["npm", "start"]