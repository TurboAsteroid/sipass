const axios = require('axios')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const config = require('./config')
// получаем права из моей базы
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
module.exports = {
  userPermissions: async function (login, sqlConfig) {
    let user = (login.split('@'))[0]
    let connection = await mysql.createConnection(sqlConfig)
    let permissionsSQL = await connection.query(`select * from permissions where user = '${user}'`)
    await connection.end()
    delete permissionsSQL[0][0].id
    delete permissionsSQL[0][0].user
    let len = Object.keys(permissionsSQL[0][0]).length
    let permissions = {}
    Object.assign(permissions, permissionsSQL[0][0])
    for (let i = 0; i < len; i++) {
      if (permissionsSQL[0][0][Object.keys(permissionsSQL[0][0])[i]] === 9) {
        delete permissions[Object.keys(permissionsSQL[0][0])[i]]
      }
    }
    return permissions
  },
  filterKPPS: function (kpps, permissions) {
    let allowedKpps = []
    for (let i = 0; i < kpps.length; i++) {
      for (let j = 0; j < Object.keys(permissions).length; j++) {
        if (kpps[i].value === Object.keys(permissions)[j]) { // strings!!!
          console.log(kpps[i])
          allowedKpps.push(kpps[i])
        }
      }
    }
    return allowedKpps
  },
  // возвращает список пропусков, доступных пользователю. на чтение доступны все
  getter: async function (status, req, config) {
    const kpps = await this.filterKPPS(config.kpps, req.locals.permissions)
    var sapResponse = []
    for (let i = 0; i < kpps.length; i++) {
      let response = (await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
        params: {
          status: status,
          ckeckpoint: parseInt(kpps[i].value),
          'sap-user': 'skud_uem',
          'sap-password': 'sRec137K'
        }
      })
      ).data
      for (let a = 0; a < response.length; a++) {
        response[a].KPP = kpps[i].value.toString()
        logger(response[a], status, parseInt(kpps[i].value), req)
        sapResponse.push(response[a])
      }
    }
    return sapResponse
  }
}
