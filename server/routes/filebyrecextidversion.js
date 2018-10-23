'use strict'
// const mysql = require('mysql2/promise')
// const jwt = require('jsonwebtoken')
const axios = require('axios')

module.exports = function (app, config, router) {
  // async function logger (json, jsonStatus, jsonKppId, req) {
  //   try {
  //     const token = req.headers.authorization.replace(/Bearer /g, '')
  //     const decoded = jwt.verify(token, config.jwtSecret)
  //     const connection = await mysql.createConnection(config.mariadb)
  //     await connection.execute(`INSERT INTO gs3.logs_get_data (json,\`user\`,ip,json_status,json_kpp_id, url) VALUES ('${JSON.stringify(json)}', '${decoded.login}', '${req.connection.remoteAddress}', '${jsonStatus}', '${jsonKppId}', '${req.originalUrl}');`)
  //     await connection.end()
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  router.get('/filebyrecextidversion', async function (req, res) {
    req.query.rec_ext_id = req.query.rec_ext_id.replace(' ', '%20')
    let url = `https://sap-prx.ugmk.com/ummc/permit/file?rec_ext_id=${req.query.rec_ext_id}&version=${req.query.version}&sap-user=skud_uem&sap-password=sRec137K`
    axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })
      .then(resSap => {
        resSap.data.pipe(res)
      })
      .catch(err => console.log(err))
  })
}
