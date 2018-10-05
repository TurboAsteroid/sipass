'use strict'
const axios = require('axios')
module.exports = function (app, config, router) {
  /* GET home page. */
  router.get('/all57', async function (req, res) {
    const kpps = [11002, 11008]
    var sapResponse = []
    for (let i = 0; i < kpps.length; i++) {
      sapResponse = sapResponse.concat((
        await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
          params: {
            status: 57,
            ckeckpoint: 11002,
            'sap-user': 'skud_uem',
            'sap-password': 'sRec137K'
          }
        })
      ).data)
    }
    res.send(sapResponse)
  })

  return router
}
