'use strict'
const url = `https://sap-prx.ugmk.com/ummc/permit/file_upload?objtype=ZCARD7105&sap-user=skud_uem&sap-password=sRec137K&objkey=000000000000000500000004256000000`
module.exports = function (app, config, router) {
  const request = require('request')
  const multipart = require('connect-multiparty')
  const multipartMiddleware = multipart()
  const fs = require('fs')
  router.post('/attachfiles', multipartMiddleware, function (req, res) {
    const f = req.files
    if (f !== null || f !== undefined) { // очередная проверка на существование файла
      fs.readFile(f.files[0].path, function (err, data) { // читаем файл из потока, который пришел постом
        if (!err) { // продолжаем, если не ошибка чтения
          var newPath = __dirname + f.files[0].path // путь до файла, в который будет произведена запись
          fs.writeFile(newPath, data, function (err) { // пишем в файл
            if (!err) { // если не ошибка записи
              var req = request.post(url, function (err, resp, body) { // делаем запрос на пост в сап
                res.end()
              })
              let form1 = req.form() // будем отправлять как форма в html
              form1.append('file', fs.createReadStream(newPath)) // говорим, что пишем файл из потока, который читаем с файловой системы сервера
              // fs.unlink(newPath) // удаляем файл
              form1.submit()
            } else {
              res.sendStatus(500).send({
                success: false,
                message: 'Ошибка записи полученного файла на сервере Node.JS: ' + err.message
              })
            }
          })
        } else {
          res.sendStatus(500).send({ // отправляем ошибку
            success: false,
            message: 'Ошибка чтения полученного файла на сервере Node.JS: ' + err.message
          })
        }
      })
    }
  })
  return router
}
