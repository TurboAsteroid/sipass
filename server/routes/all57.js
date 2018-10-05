'use strict'
const axios = require('axios')
module.exports = function (app, config, router) {
  /* GET home page. */
  router.get('/all57', async function (req, res) {
    const kpps = [11002, 11008]
    var sapResponse = []
    for (let i = 0; i < kpps.length; i++) {
      let response = (await axios.get(`https://sap-prx.ugmk.com:443/ummc/permit/list`, {
        params: {
          status: 57,
          ckeckpoint: kpps[i],
          'sap-user': 'skud_uem',
          'sap-password': 'sRec137K'
        }
      })
      ).data
      for (let a = 0; a < response.length; a++) {
        response[a].KPP = kpps[i].toString()
        sapResponse.push(response[a])
      }
    }
    res.send(sapResponse)
  })

  return router
}
