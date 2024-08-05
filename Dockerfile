FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -f

COPY . .

COPY ./.env ./

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
