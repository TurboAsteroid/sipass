'use strict'
const DataBase = require('../db')
const path = require('path')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const helpers = require('../helpers')
const axios = require('axios')
module.exports = function (app, config, router) {
  async function logger (propusk, jwtUser, ip) {
    try {
      const decoded = jwt.verify(jwtUser, config.jwtSecret)
      if (propusk === undefined || propusk === '' || propusk === null) {
        propusk = -1
      }
      // await DataBase.Execute(`INSERT INTO gs3.logs_photo (propusk,\`user\`,ip) VALUES ('${propusk}', '${decoded.login}', '${ip}');`)
      await DataBase.Q(`INSERT INTO gs3.logs_photo SET ?`, { propusk: propusk, user: decoded.login, ip: ip })
    } catch (e) {
      console.error(e)
    }
  }
  router.get('/photobycardid_old', async function (req, res) {
    const propusk = req.query.propusk
    try {
      await logger(propusk, req.query.jwt, req.connection.remoteAddress)
      if (propusk !== undefined && propusk !== null && propusk !== '') {
        if (fs.existsSync(path.join(__dirname, `../data/${propusk}.jpg`))) {
          // посмотреть есть вообще ли доступ к пропуску
          let doc = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
            params: {
              propusk: req.query.propusk,
              'sap-user': config.sap.u,
              'sap-password': config.sap.p
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

  router.get('/photobycardid', async function (req, res) {
    const propusk = req.query.propusk
    try {
      await logger(propusk, req.query.jwt, req.connection.remoteAddress)
      if (propusk !== undefined && propusk !== null && propusk !== '') {
        // забрать весь кэш
        const cache = await DataBase.Q(`select * from gs3.cache where fullCardN = ${propusk}`)
        if (cache[0].length > 0) {
          const kpps = await helpers.filterKPPS(config.kpps, req.locals.permissions) // доступные кпп
          let allowed = kpps.filter(it => cache[0][0].KPP.toString() === it.value)
          // посмотреть есть вообще ли доступ к пропуску
          let doc = JSON.parse(cache[0][0].json)
          if (doc.STATUS !== '' && allowed.length > 0) {
            let ret = await helpers.searchDocInListByDoknr([doc], {DATA_CARD: doc})
            if (ret.result) {
              res.send(cache[0][0].photo).end() // доступ есть
            } else {
              res.sendStatus(403)
            }
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
