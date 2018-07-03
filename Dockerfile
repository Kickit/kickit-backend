
FROM node:latest

RUN mkdir /app
WORKDIR /app
COPY package.json /app/
EXPOSE 3030:3030 27017:27017

RUN npm install

CMD [ "npm", "start" ]