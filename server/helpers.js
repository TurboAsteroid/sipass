const mysql = require('mysql2/promise')
// получаем права из моей базы
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
  }
}
