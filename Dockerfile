FROM node:16.17-alpine
RUN apk update && apk upgrade && apk add make gcc g++ python3 --no-cache
RUN npm install -g typescript --no-cache

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn --no-cache
COPY src .
RUN yarn build --no-cache
EXPOSE 3000
CMD ["node", "dist/index.js"]
