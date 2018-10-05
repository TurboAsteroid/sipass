'use strict'
const http = require('http')
const app8686 = require('./app')
const server = http.createServer(app8686)
server.listen(8686, () => {
  console.log('HTTP Server running on port 8686')
})
