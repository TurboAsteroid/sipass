'use strict'
const app8686 = require('./app')
const fs = require('fs')
const https = require('https')
const config = require('./config')

const credentials = {
  key: fs.readFileSync(config.keys.privkey, 'utf8'),
  cert: fs.readFileSync(config.keys.cert, 'utf8'),
  ca: fs.readFileSync(config.keys.chain, 'utf8')
}
const server = https.createServer(credentials, app8686)
server.listen(8686, () => {
  console.log('HTTPS Server running on port 8686')
})
