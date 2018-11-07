'use strict'
const app8686 = require('./app')
const fs = require('fs')
const https = require('https')

const privateKey = fs.readFileSync('/etc/letsencrypt/live/apps.elem.ru/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/apps.elem.ru/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/apps.elem.ru/chain.pem', 'utf8')

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
}
const server = https.createServer(credentials, app8686)
server.listen(8686, () => {
  console.log('HTTP Server running on port 8686')
})
