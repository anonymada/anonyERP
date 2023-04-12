FROM node:14-alpine
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8002
CMD npm start
