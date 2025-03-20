FROM node:lts-alpine

WORKDIR /home/api

COPY package*.json .

RUN npm install 

COPY . . 

RUN npx prisma generate 

EXPOSE 3333

CMD npm run start:dev