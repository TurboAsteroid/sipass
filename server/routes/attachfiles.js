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
        fs.renameSync(dest + '/' + it.filename, dest + '/' + it.originalname)
        var req = request.post(`https://sap-prx.ugmk.com/ummc/permit/file_upload?objtype=ZCARD7105&sap-user=${config.sap.u}&sap-password=${config.sap.p}&objkey=${reqQQQ.query.objkey}`)
        var form = req.form()
        form.append('file', fs.createReadStream(dest + '/' + it.originalname))
      } catch (e) {
        console.error(e)
      }
    })
    resSSS.end()
  })
  return router
}
