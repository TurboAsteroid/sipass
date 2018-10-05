'use strict'
var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var app = express()
var config = require('./config')

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
require('./routes/tags')(app, config, router)

app.use(router)
module.exports = app
