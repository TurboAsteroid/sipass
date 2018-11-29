'use strict'
const DataBase = require('./db')
const sql = require('mssql')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const schedule = require('node-schedule')
module.exports = function (app, config, router) {
  // eslint-disable-next-line
  String.prototype.replaceAll = function (search, replacement) {
    var target = this
    return target.replace(new RegExp(search, 'g'), replacement)
  }

  async function logger (empId, text, card) {
    try {
      await DataBase.Q(`INSERT INTO gs3.logs_photo_sync SET ?`, { emp_id: empId, text: text, card: card })
    } catch (e) {
      console.error(e)
    }
  }
  async function main () {
    const kpps = config.kpps
    // получаем все листы и скидываем в массив номера всех карточек
    const cards = [] // номера всех карточек для всех пропусков со статусом 53
    const dataAll = [] // все пропуски на всех кпп со статусом 53
    for (let i = 0; i < kpps.length; i++) {
      let dataKpp = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/list?status=53&ckeckpoint=${parseInt(kpps[i].value)}`)).data
      for (let j = 0; j < dataKpp.length; j++) {
        dataAll.push(dataKpp[j])
      }
      for (let j = 0; j < dataAll.length; j++) {
        for (let s = 0; s < dataAll[j].ZPROPUSK.length; s++) {
          if (dataAll[j].ZPROPUSK[s] === '2' && dataAll[j].ZPROPUSK[s + 1] === '1' && dataAll[j].ZPROPUSK[s + 2] === '5') {
            let numberForSqlReq = ''
            for (let m = s + 3; m < dataAll[j].ZPROPUSK.length; m++) {
              numberForSqlReq += dataAll[j].ZPROPUSK[m]
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
          cl_1.facility,
          '00' + CONVERT(varchar, 21500000 + cast(cl_1.number as bigint)) as fullCardN
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
    if (changedFlag) {
      try {
        // открываем пул подключения к серверу сипасса
        const pool = new sql.ConnectionPool(config.configSiPass)
        pool.on('error', err => {
          console.log(new Date() + '::: sql errors ', err)
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
                // if (result.recordset[c].facility.toString() === '0') {
                //   result.recordset[c].facility = '215'
                // }
                // let fullCardN = (result.recordset[c].facility.toString() + result.recordset[c].number.toString())
                // if (fullCardN.length < 10) {
                //   let zero = 10 - parseInt(fullCardN.length)
                //   for (let f = 0; f < zero; f++) {
                //     fullCardN = '0' + fullCardN
                //   }
                // }
                var photo = await pool.request().query(`SELECT BulkColumn FROM OPENROWSET(BULK '` + result.recordset[c].path +
                  `', SINGLE_BLOB) AS Contents;`)
                // пишем историю
                let query = 'INSERT INTO gs3.history SET ? ON DUPLICATE KEY UPDATE doknr = doknr'
                let values = {
                  doknr: dataAll[c].DOKNR,
                  fullCardN: result.recordset[c].fullCardN,
                  json: JSON.stringify(dataAll[c])
                  // ,
                  // photo: photo.recordset[0].BulkColumn
                }
                // const mysql = require('mysql2/promise')
                // const lol = await mysql.createConnection(config.mariadb)
                // await lol.query(query, values)
                await DataBase.Q(query, values)
                if (await fs.existsSync(path.join(__dirname, `data/${result.recordset[c].fullCardN.toString()}.jpg`))) {
                  await fs.unlinkSync(path.join(__dirname, `data/${result.recordset[c].fullCardN.toString()}.jpg`))
                }
                var wstream = fs.createWriteStream(path.join(__dirname, `data/${result.recordset[c].fullCardN.toString()}.jpg`))
                if (photo.recordset[0].BulkColumn.length !== 366704) {
                  await wstream.write(Buffer.from(photo.recordset[0].BulkColumn))
                  console.log(`${new Date()} ::: на фс записана фотка карточки fullCardN: ${result.recordset[c].fullCardN}`)
                } else {
                  await fs.copyFileSync(path.join(__dirname, `default.jpg`), path.join(__dirname, `data/${result.recordset[c].fullCardN.toString()}.jpg`))
                  console.error(`${new Date()} ::: на фс записана фотка карточки fullCardN: ${result.recordset[c].fullCardN}`)
                }
                await logger(result.recordset[c].emp_id, 'done', result.recordset[c].fullCardN)
              } catch (err) {
                console.error(`${new Date()} ::: ошибка работы с фоткой ${err}`)
                await logger(result.recordset[c].emp_id, (err.toString().replaceAll('/', '_')).replaceAll('\'', ''), -1)
              }
              wstream.end()
            }
            console.log(new Date() + '::: done')
          }
        } catch (err) {
          console.log(new Date() + '::: ' + err)
          await logger(-1, (err.toString().replaceAll('/', '_')).replaceAll('\'', ''), -1)
        } finally {
          pool.close()
          console.log(new Date() + '::: pool.close() done')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  schedule.scheduleJob('*/1 * * * *', function () { // каждую минуту
    main()
  })

  router.get('/getallphotos', async function (req, res) {
    await main()
    res.sendStatus(200)
  })
}
