'use strict'
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const app = express()
const config = require('./config')

app.use(cors({origin: '*'}))
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By') // чтобы не палить кто сервер
  next()
})
app.use(logger('dev'))
app.use(express.json()) // it is body-parser
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

let router = express.Router()
require('./routes/auth')(app, config, router)
require('./routes/all')(app, config, router)
require('./routes/bydoknr')(app, config, router)
require('./routes/bycardid')(app, config, router)
require('./routes/photobycardid')(app, config, router)
// require('./routes/photobydoknr')(app, config, router)
require('./routes/filebyrecextidversion')(app, config, router)
require('./routes/attachfiles')(app, config, router)
require('./routes/doit')(app, config, router)
require('./getallphotos')(app, config, router)
app.use(router)
module.exports = app
