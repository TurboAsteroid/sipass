'use strict'
const axios = require('axios')
const helpers = require('../helpers')
module.exports = function (app, config, router) {
  router.get('/bycardid', async function (req, res) {
    let doc = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
      params: {
        propusk: req.query.propusk,
        'sap-user': 'skud_uem',
        'sap-password': 'sRec137K'
      }
    })
    ).data
    let ret = await helpers.isUserHasAccessToDoc(doc, req, config)
    if (typeof ret === 'number') {
      res.sendStatus(404)
    } else {
      res.send(ret)
    }
  })

  return router
}
