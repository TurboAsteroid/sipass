'use strict'
const axios = require('axios')
module.exports = function (app, config, router) {
  /* GET home page. */
  router.get('/all57', async function (req, res) {
    const sapResponse = await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
      params: {
        status: 57,
        ckeckpoint: 11002,
        'sap-user': 'skud_uem',
        'sap-password': 'sRec137K'
      }
    })
    res.send(sapResponse.data)
  })

  return router
}
