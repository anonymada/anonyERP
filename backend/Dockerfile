FROM node:22-alpine
WORKDIR /backend
RUN npm install --global npm@10.9.4
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8002
CMD ["npm", "start"]