'use strict'
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
module.exports = function (app, config, router) {
  async function logger (json, jsonStatus, jsonKppId, req) {
    try {
      const token = req.headers.authorization.replace(/Bearer /g, '')
      const decoded = jwt.verify(token, config.jwtSecret)
      const connection = await mysql.createConnection(config.mariadb)
      await connection.execute(`INSERT INTO gs3.logs_get_data (json,\`user\`,ip,json_status,json_kpp_id, url) VALUES ('${JSON.stringify(json)}', '${decoded.login}', '${req.connection.remoteAddress}', '${jsonStatus}', '${jsonKppId}', '${req.originalUrl}');`)
      await connection.end()
    } catch (e) {
      console.error(e)
    }
  }
  router.get('/photobycardid', async function (req, res) {
    const propusk = req.query.propusk
    res.sendFile(path.join(__dirname, '../data/kindred.jpg'))

    // logger(response, 1, 1, req) // by propusk
  })

  return router
}
