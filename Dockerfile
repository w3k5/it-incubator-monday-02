FROM node:16.17-alpine
RUN apk update && apk upgrade && apk add make gcc g++ python3
RUN npm install -g typescript

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["node", "dist/index.js"]
