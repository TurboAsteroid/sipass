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
  router.get('/bycardid', async function (req, res) {
    const list = await helpers.getter(57, req, config)
    let response = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
      params: {
        propusk: req.query.propusk,
        'sap-user': 'skud_uem',
        'sap-password': 'sRec137K'
      }
    })
    ).data
    for (let i = 0; i < list.length; i++) {
      if (list[i].ZPROPUSK === req.query.propusk) {
        logger(response, 1, 1, req) // by propusk
        console.log(response)
        res.send(response)
        return
      }
    }
    logger('404: пропуск не найден или нет прав и пользователь ломится не туда', 1, 1, req) // by propusk\
    res.sendStatus(404)
  })

  return router
}
