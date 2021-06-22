FROM node:12

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

RUN yarn install --silent

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]
