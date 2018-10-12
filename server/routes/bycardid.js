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
  router.get('/bycardid', async function (req, res) {
    console.log(`https://sap-prx.ugmk.com:443/ummc/permit/main?propusk=${req.query.propusk}&sap-user=skud_uem&sap-password=sRec137K`)
    let response = (await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/main`, {
      params: {
        propusk: req.query.propusk,
        'sap-user': 'skud_uem',
        'sap-password': 'sRec137K'
      }
    })
    ).data
    logger(response, 1, 1, req) // by propusk
    console.log(response)
    res.send(response)
  })

  return router
}
// https://sap-prx.ugmk.com:443/ummc/permit/main?propusk=0021559927&sap-user=skud_uem&sap-password=sRec137K
//         ckeckpoint: req.query.kpp,
//         'sap-user': 'skud_uem',
//         'sap-password': 'sRec137K'
