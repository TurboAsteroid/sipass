'use strict'
const axios = require('axios')
const helpers = require('../helpers')
module.exports = function (app, config, router) {
  router.get('/bycardid', async function (req, res) {
    let docbycardid = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
      params: {
        propusk: req.query.propusk,
        'sap-user': config.sap.u,
        'sap-password': config.sap.p
      }
    })
    ).data
    const sapno = docbycardid.DATA_CARD.DOKNR
    let kpp = 0
    for (let i = 0; i < docbycardid.APPRDATA.length; i++) {
      if (docbycardid.APPRDATA[i].APRNAME.toString() === '11002') {
        kpp = 11002
        break
      }
      if (docbycardid.APPRDATA[i].APRNAME.toString() === '11008') {
        kpp = 11008
        break
      }
    }
    let doc = (await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main`, {
      params: {
        doknr: sapno,
        ckeckpoint: kpp.toString(),
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
