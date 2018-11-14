'use strict'
const path = require('path')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const helpers = require('../helpers')
const axios = require('axios')
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
          // посмотреть есть вообще ли доступ к пропуску
          let doc = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
            params: {
              propusk: req.query.propusk,
              'sap-user': 'skud_uem',
              'sap-password': 'sRec137K'
            }
          })).data
          let ret = await helpers.isUserHasAccessToDoc(doc, req, config)
          if (typeof ret === 'number') {
            res.sendFile(path.join(__dirname, '../default.jpg')) // доступа нет но файл есть на диске
          } else {
            res.sendFile(path.join(__dirname, `../data/${propusk}.jpg`)) // доступ есть и файл есть на диске
          }
        } else {
          res.sendFile(path.join(__dirname, '../default.jpg')) // файла нет на диске
        }
      } else {
        res.sendFile(path.join(__dirname, '../default.jpg')) // ошибка в запросе
      }
    } catch (e) {
      console.log(e)
      res.sendStatus(404)
    }
  })

  return router
}
