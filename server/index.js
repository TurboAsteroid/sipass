'use strict'
const http = require('http')
const express = require('express')
const app8686 = express()
const httpServer8686 = http.createServer(app8686)
httpServer8686.listen(8686, () => {
  console.log('HTTP Server running on port 8686')
})
