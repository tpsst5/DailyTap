FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 19000 19001 19002 19006

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
