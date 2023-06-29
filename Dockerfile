FROM node:18.16.1-alpine

WORKDIR /app

COPY .npmrc package.json ./
RUN yarn install

COPY . ./
RUN yarn build

CMD ["node", ".output/server/index.mjs"]