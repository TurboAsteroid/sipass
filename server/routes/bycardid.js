'use strict'
const axios = require('axios')
const helpers = require('../helpers')
module.exports = function (app, config, router) {
  router.get('/bycardid', async function (req, res) {
    let doc = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
      params: {
        propusk: req.query.propusk,
        'sap-user': config.sap.u,
        'sap-password': config.sap.p
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
