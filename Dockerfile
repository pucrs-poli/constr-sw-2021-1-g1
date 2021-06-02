FROM node:12

# Create app directory
WORKDIR /app

COPY package*.json /app/package.json

RUN npm install
ENV NODE_ENV=production

RUN yarn install --silent

COPY . /app

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]
