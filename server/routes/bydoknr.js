'use strict'
const axios = require('axios')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const helpers = require('../helpers')
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
  router.get('/bydoknr', async function (req, res) {
    let doc = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
      params: {
        doknr: req.query.doknr,
        ckeckpoint: req.query.kpp,
        'sap-user': 'skud_uem',
        'sap-password': 'sRec137K'
      }
    })
    ).data
    if (doc.STATUS !== '') {
      let list = await helpers.getter(doc.STATUS, req, config)
      if (helpers.searchDocInListByDoknr(list, doc)) {
        logger(doc, 1, req.query.kpp, req) // by doknr
        res.send(doc)
      } else {
        logger(`404 ${doc}`, 1, req.query.kpp, req) // by doknr
        res.sendStatus(404)
      }
    } else {
      logger(`404 ${doc}`, 1, req.query.kpp, req) // by doknr
      res.sendStatus(404)
    }
  })

  return router
}
