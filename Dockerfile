FROM node:alpine

RUN apk update

RUN mkdir app/

ADD . /app

WORKDIR /app

RUN npm install

CMD npm start