FROM node:latest
RUN npm install pm2 -g --silent
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
RUN mkdir -p /etc/letsencrypt
COPY . .
RUN npm run build
EXPOSE 8080
EXPOSE 8525
EXPOSE 8526
EXPOSE 8686
CMD ['pm2-docker', 'process.yml']
