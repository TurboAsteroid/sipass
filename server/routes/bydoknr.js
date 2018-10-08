'use strict'
const axios = require('axios')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
module.exports = function (app, config, router) {
  async function logger (json, jsonStatus, jsonKppId, req) {
    try {
      const token = req.headers.authorization.replace(/Bearer /g, '')
      const decoded = jwt.verify(token, config.jwtSecret)
      const connection = await mysql.createConnection(config.mariadb)
      await connection.execute(`INSERT INTO gs3.logs_get_data (json,\`user\`,ip,json_status,json_kpp_id, url) VALUES ('${JSON.stringify(json)}', '${decoded.login}', '${req.connection.remoteAddress}', '${jsonStatus}', '${jsonKppId}', '${req.originalUrl}');`)
    } catch (e) {
      console.error(e)
    }
  }
  router.get('/bydoknr', async function (req, res) {
    console.log(`https://sap-prx.ugmk.com:443/ummc/permit/main?doknr=${req.query.doknr}&ckeckpoint=${req.query.kpp}&sap-user=skud_uem&sap-password=sRec137K`)
    let response = (await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/main`, {
      params: {
        doknr: req.query.doknr,
        ckeckpoint: req.query.kpp,
        'sap-user': 'skud_uem',
        'sap-password': 'sRec137K'
      }
    })
    ).data
    logger(response, 1, req.query.kpp, req) // by doknr
    console.log(response)
    res.send(response)
  })

  return router
}
