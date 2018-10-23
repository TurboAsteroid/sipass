'use strict'
const sql = require('mssql')
const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise')

module.exports = async function (app, config, router) {
  async function logger (empId, text, card, connection) {
    try {
      await connection.execute(`INSERT INTO gs3.logs_img_sync (emp_id, \`text\`, card) VALUES (${empId}, '${text}', ${card})`)
    } catch (e) {
      console.error(e)
    }
  }

  router.get('/getallphotos', async function (req, res) {
    // открываем пул подключения к серверу сипасса
    const pool = new sql.ConnectionPool(config.configSiPass)
    const connection = await mysql.createConnection(config.mariadb)
    pool.on('error', err => {
      console.log(new Date() + '::: sql errors ', err)
      res.status(500).end()
    })
    try {
      await pool.connect()
      let result = await pool.request().query(varsql())
      if (result.recordset.length > 0) {
        const last = result.recordset.length
        for (var c = 0; c < last; c++) {
          if (result.recordset[c].emp_id === 'null') {
            result.recordset[c].emp_id = -1
          }
          try {
            if (result.recordset[c].facility.toString() === '0') {
              result.recordset[c].facility = '215'
            }
            let tmp = (result.recordset[c].facility.toString() + result.recordset[c].number.toString())
            if (tmp.length < 10) {
              let zero = 10 - parseInt(tmp.length)
              for (let f = 0; f < zero; f++) {
                tmp = '0' + tmp
              }
            }
            var wstream = fs.createWriteStream(path.join(__dirname, `data/${tmp.toString()}.jpg`))
            var photo = await pool.request().query(`SELECT BulkColumn FROM OPENROWSET(BULK '` + result.recordset[c].path +
                                                  `', SINGLE_BLOB) AS Contents;`)
            if (photo.recordset[0].BulkColumn.length !== 366704) {
              await wstream.write(Buffer.from(photo.recordset[0].BulkColumn))
            } else {
              await wstream.write(Buffer.from([]))
            }
            console.log(new Date() + '::: emp_id: ' + result.recordset[c].emp_id)
            await logger(result.recordset[c].emp_id, 'done', tmp, connection)
          } catch (err) {
            console.error(new Date() + '::: emp_id: ' + result.recordset[c].emp_id + ' ::: ' + err)
            await logger(result.recordset[c].emp_id, err, 0, connection)
          }
          wstream.end()
        }
        console.log(new Date() + '::: done')
        res.status(200).end()
      }
    } catch (err) {
      console.log(new Date() + '::: ' + err)
      await logger(0, err, 0, connection)
    } finally {
      pool.close()
      connection.end()
      console.log(new Date() + '::: pool.close() done')
      res.status(200).end()
    }
  })
}
const varsql = function () {
  var a = `
        SELECT
          el.emp_id,
          'C:\\Program Files (x86)\\SiPass integrated\\DataFolder\\Drawing\\EmployeeImages\\' +
          SUBSTRING(CONVERT(varchar, CONVERT(VARBINARY(8), el.emp_id),1),3,2) + '\\' +
          SUBSTRING(CONVERT(varchar, CONVERT(VARBINARY(8), el.emp_id),1),5,2) + '\\' +
          SUBSTRING(CONVERT(varchar, CONVERT(VARBINARY(8), el.emp_id),1),7,2) + '\\' +
          SUBSTRING(CONVERT(varchar, CONVERT(VARBINARY(8), el.emp_id),1),3,8) + 'P.jpg' as path,
          cl_1.number,
          cl_1.facility
        FROM asco.employee_legacy AS el 
          INNER JOIN asco.cardholder AS ch ON el.cardholder_id = ch.cardholder_id
          LEFT OUTER JOIN asco.card_physical AS cp_1 ON ch.cardholder_id = cp_1.cardholder_id AND cp_1.rank = 1
          LEFT OUTER JOIN asco.card_logical AS cl_1 ON cp_1.card_physical_id = cl_1.card_physical_id AND cl_1.rank = 1`
  return a
}
