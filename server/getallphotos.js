'use strict'
var crypto = require('crypto')
const sql = require('mssql')
const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise')
const axios = require('axios')
module.exports = async function (app, config, router) {
  async function logger (empId, text, card, connection) {
    try {
      await connection.execute(`INSERT INTO gs3.logs_img_sync (emp_id, \`text\`, card) VALUES (${empId}, '${text}', ${card})`)
    } catch (e) {
      console.error(e)
    }
  }
  async function logger0 (cards, connection, req) {
    try {
      await connection.execute(`INSERT INTO gs3.logs_cards_for_img_sync (cards, ip) VALUES ('${cards}', '${req.connection.remoteAddress}')`)
    } catch (e) {
      console.error(e)
    }
  }

  router.get('/getallphotos', async function (req, res) {
    const kpps = config.kpps
    // получаем все листы и скидываем в массив номера всех карточек
    const cards = []
    for (let i = 0; i < kpps.length; i++) {
      const data = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/list?status=53&ckeckpoint=${kpps[i]}`)).data
      for (let j = 0; j < data.length; j++) {
        for (let s = 0; s < data[j].ZPROPUSK.length; s++) {
          if (data[j].ZPROPUSK[s] === '2' && data[j].ZPROPUSK[s + 1] === '1' && data[j].ZPROPUSK[s + 2] === '5') {
            let numberForSqlReq = ''
            for (let m = s + 3; m < data[j].ZPROPUSK.length; m++) {
              numberForSqlReq += data[j].ZPROPUSK[m]
            }
            cards.push(numberForSqlReq)
            break
          }
        }
      }
    }
    // формируем запрос на получение фоток текущих карточек
    let sqlReq = `
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
          LEFT OUTER JOIN asco.card_logical AS cl_1 ON cp_1.card_physical_id = cl_1.card_physical_id AND cl_1.rank = 1 where`
    let changedFlag = false
    for (let i = 0; i < cards.length; i++) {
      if (cards.length === i + 1) {
        sqlReq += ` number = ${cards[i]}`
        changedFlag = true
      } else {
        sqlReq += ` number = ${cards[i]} or`
        changedFlag = true
      }
    }
    try {
      let connection = await mysql.createConnection(config.mariadb)
      await logger0(cards, connection, req)
      connection.end()
    } catch (e) {
      console.error('logger0 error: ', e.message)
    }
    if (changedFlag) {
    // открываем пул подключения к серверу сипасса
      const pool = new sql.ConnectionPool(config.configSiPass)
      const connection = await mysql.createConnection(config.mariadb)
      pool.on('error', err => {
        console.log(new Date() + '::: sql errors ', err)
        res.status(500).end()
      })
      try {
        await pool.connect()
        let result = await pool.request().query(sqlReq)
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
              console.log(crypto.createHash('md5').update(photo).digest('hex'))
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
    } else {
      res.status(200).end()
    }
  })
}
