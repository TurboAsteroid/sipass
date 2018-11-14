'use strict'
const axios = require('axios')
const querystring = require('querystring')

module.exports = function (app, config, router) {
  router.post('/doit', async function (req, res) {
    if (req.body.action === 'IN') {
      await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main?sap-user=skud_uem&sap-password=sRec137K&action=IN
                        &doknr=${req.body.doknr}
                        &ckeckpoint=${req.body.ckeckpoint}`)
    } else if (req.action === 'RET') {
      await axios.post(`https://sap-prx.ugmk.com/ummc/permit/main?sap-user=skud_uem&sap-password=sRec137K&action=RET
                        &doknr=${req.body.doknr}
                        &ckeckpoint=${req.body.ckeckpoint}`, querystring.stringify({ notes: req.body.notes }))
    }
    res.sendStatus(200)
  })
  return router
}
