FROM node:22-alpine

RUN apk add --no-cache make gcc g++ python3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]