'use strict'
const path = require('path')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const fs = require('fs')
module.exports = function (app, config, router) {
  async function logger (propusk, jwtUser, ip) {
    try {
      const decoded = jwt.verify(jwtUser, config.jwtSecret)
      const connection = await mysql.createConnection(config.mariadb)
      if (propusk === undefined || propusk === '' || propusk === null) {
        propusk = -1
      }
      await connection.execute(`INSERT INTO gs3.logs_photo (propusk,\`user\`,ip) VALUES ('${propusk}', '${decoded.login}', '${ip}');`)
      await connection.end()
    } catch (e) {
      console.error(e)
    }
  }
  router.get('/photobycardid', async function (req, res) {
    const propusk = req.query.propusk
    try {
      await logger(propusk, req.query.jwt, req.connection.remoteAddress)
      if (propusk !== undefined && propusk !== null && propusk !== '') {
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
      res.sendStatus(404)
    }
  })

  return router
}
