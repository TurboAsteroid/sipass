'use strict'
const path = require('path')
const dest = path.join(__dirname, '../tmp')
const multer = require('multer')
const upload = multer({ dest: dest })
const request = require('request')
const fs = require('fs')

module.exports = function (app, config, router) {
  router.post('/attachfiles', upload.array('files', 20), function (reqQQQ, resSSS) {
    reqQQQ.files.forEach(async function (it) {
      try {
        await fs.writeFile(dest + '/' + it.originalname, it.buffer, function (err) {
          var req = request.post(`https://sap-prx.ugmk.com/ummc/permit/file_upload?objtype=ZCARD7105&sap-user=skud_uem&sap-password=sRec137K&objkey=${reqQQQ.query.objkey}`)
          var form = req.form()
          form.append('file', fs.createReadStream(dest + '/' + it.originalname))
        })
      } catch (e) {
        console.error(e)
      }
    })
    resSSS.end()
  })
  return router
}
