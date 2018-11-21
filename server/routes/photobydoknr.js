'use strict'
const mysql = require('mysql2/promise')
// const jwt = require('jsonwebtoken')
module.exports = function (app, config, router) {
  router.get('/photobydoknr', async function (req, res) {
    let doknr = req.query.doknr
    let fullCardN = req.query.fullCardN
    try {
      // const decoded = jwt.verify(jwtUser, config.jwtSecret)
      const connection = await mysql.createConnection(config.mariadb)
      if (doknr === undefined || doknr === '' || doknr === null) {
        doknr = -1
      }
      if (fullCardN === undefined || fullCardN === '' || fullCardN === null) {
        fullCardN = -1
      }
      const photo = await connection.execute(`select photo from history where doknr = ${doknr} and fullCardN = ${fullCardN}`)
      await connection.end()
      res.send(photo[0][0].photo)
    } catch (e) {
      console.error(e)
    }
  })
}
