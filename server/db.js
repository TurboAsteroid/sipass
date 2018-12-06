const mysql = require('mysql2/promise')
const config = require('./config')

const dbWorder = {
  connection: null,
  connect: async function () {
    try {
      this.connection = await mysql.createConnection(config.mariadb)
      return 0
    } catch (err) {
      console.error(`dbWorder. function connect error. ${err.message}`)
    }
    return 1
  },
  Q: async function (query, params) {
    try {
      await this.connection.query('select 1 as alive')
    } catch (err) {
      await this.connect()
    }
    let sqlAns = await this.connection.query(query, params)
    return sqlAns
  }
}
module.exports = dbWorder
