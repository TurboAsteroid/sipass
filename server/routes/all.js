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

  async function getter (status, req) {
    const kpps = [11002, 11008]
    var sapResponse = []
    for (let i = 0; i < kpps.length; i++) {
      let response = (await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
        params: {
          status: status,
          ckeckpoint: kpps[i],
          'sap-user': 'skud_uem',
          'sap-password': 'sRec137K'
        }
      })
      ).data
      for (let a = 0; a < response.length; a++) {
        response[a].KPP = kpps[i].toString()
        logger(response[a], status, kpps[i], req)
        sapResponse.push(response[a])
      }
    }
    return sapResponse
  }
  router.get('/all51', async function (req, res) {
    const data = await getter(51, req)
    console.log(data)
    res.send(data)
  })
  router.get('/all57', async function (req, res) {
    const data = await getter(57, req)
    console.log(data)
    res.send(data)
  })
  router.get('/all53', async function (req, res) {
    const data = await getter(53, req)
    console.log(data)
    res.send(data)
  })

  return router
}
