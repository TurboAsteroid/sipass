'use strict'
const path = require('path')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const fs = require('fs')
module.exports = function (app, config, router) {
  async function logger (req) {
    try {
      const decoded = jwt.verify(req.query.jwt, config.jwtSecret)
      const connection = await mysql.createConnection(config.mariadb)
      req.query.propusk = -1
      await connection.execute(`INSERT INTO gs3.logs_photo (propusk,\`user\`,ip) VALUES ('${req.query.propusk}', '${decoded.login}', '${req.connection.remoteAddress}');`)
      await connection.end()
    } catch (e) {
      console.error(e)
    }
  }
  router.get('/photobycardid', async function (req, res) {
    const propusk = req.query.propusk
    try {
      logger(req)
      if (propusk !== undefined && propusk !== null) {
        if (fs.existsSync(path.join(__dirname, `../data/${propusk}.jpg`))) {
          res.sendFile(path.join(__dirname, `../data/${propusk}.jpg`))
        } else {
          res.sendFile(path.join(__dirname, '../default.jpg'))
        }
      } else {
        res.sendFile(path.join(__dirname, '../default.jpg'))
      }
    } catch (e) {
      console.log(e)
    }
  })

  return router
}
