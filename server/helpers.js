const axios = require('axios')
const DataBase = require('./db')
const jwt = require('jsonwebtoken')
const config = require('./config')
async function logger (json, jsonStatus, jsonKppId, req) {
  try {
    let token
    if (req.query.jwt) {
      token = req.query.jwt
    } else {
      token = req.headers.authorization.replace(/Bearer /g, '')
    }
    // await DataBase.Execute(`INSERT INTO gs3.logs_get_data (json,\`user\`,ip,json_status,json_kpp_id, url) VALUES ('${JSON.stringify(json)}', '${decoded.login}', '${req.connection.remoteAddress}', '${jsonStatus}', '${jsonKppId}', '${req.originalUrl}');`)
    await DataBase.Q(
      `INSERT INTO gs3.logs_get_data SET ?`,
      { json: JSON.stringify(json), user: (jwt.verify(token, config.jwtSecret)).login, ip: req.connection.remoteAddress, json_status: jsonStatus, json_kpp_id: jsonKppId, url: req.originalUrl }
    )
  } catch (e) {
    console.error(e)
  }
}
module.exports = {
  userPermissions: async function (login, sqlConfig) {
    let user = (login.split('@'))[0]
    let permissionsSQL = await DataBase.Q(`select * from permissions where user = '${user}'`)
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
          allowedKpps.push(kpps[i])
        }
      }
    }
    return allowedKpps
  },
  // возвращает список пропусков, доступных пользователю. на чтение доступны все
  // status - 51/57/53
  getter: async function (status, req, config) {
    const kpps = await this.filterKPPS(config.kpps, req.locals.permissions)
    var sapResponse = []
    for (let i = 0; i < kpps.length; i++) {
      let response = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/list`, {
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
  },
  searchDocInListByDoknr: function (list, doc) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].DOKNR === doc.DATA_CARD.DOKNR) {
        return { result: true, kpp: list[i].KPP }
      }
    }
    return { result: false, kpp: -1 }
  },
  isUserHasAccessToDoc: async function (doc, req, config) {
    if (doc.STATUS !== '') {
      let list = await this.getter(doc.STATUS, req, config)
      let searchResult = this.searchDocInListByDoknr(list, doc)
      if (searchResult.result) {
        logger(doc, 1, searchResult.kpp, req)
        return doc
      } else {
        logger(`404: пропуск не найден или нет прав и пользователь ломится не туда ${doc}`, 1, searchResult.kpp, req) // by doknr
        return 404
      }
    } else {
      logger(`404: пропуск не найден или нет прав и пользователь ломится не туда ${doc}`, 1, -1, req)
      return 404
    }
  }
}
