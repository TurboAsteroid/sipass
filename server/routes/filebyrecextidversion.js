'use strict'
const axios = require('axios')
module.exports = function (app, config, router) {
  router.get('/filebyrecextidversion', async function (req, res) {
    req.query.rec_ext_id = req.query.rec_ext_id.replace(' ', '%20')
    let url = `https://sap-prx.ugmk.com/ummc/permit/file?rec_ext_id=${req.query.rec_ext_id}&version=${req.query.version}&sap-user=skud_uem&sap-password=sRec137K`
    axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })
      .then(resSap => {
        resSap.data.pipe(res)
      })
      .catch(err => console.log(err))
  })
}
