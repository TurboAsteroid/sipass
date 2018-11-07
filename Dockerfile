FROM node:latest
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
CMD [ "node", "static_server.js", "&", "node", "server/index.js", "&" ]
