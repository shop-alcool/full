FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./src ./src

WORKDIR /app/src

EXPOSE 5173

CMD ["npm", "run", "dev"]
