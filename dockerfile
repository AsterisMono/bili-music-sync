FROM node:16-alpine
WORKDIR /app
RUN apk update
RUN apk add ffmpeg python3
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["node", "build/index.js"]