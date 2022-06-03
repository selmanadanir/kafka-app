FROM node:18-alpine3.14

WORKDIR /app

COPY package* ./
RUN npm install

COPY . ./

# Wait script to wait until producer container becomes ready 
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD ["node", "index.js"]