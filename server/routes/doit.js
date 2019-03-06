'use strict'
const axios = require('axios')
const querystring = require('querystring')

module.exports = function (app, config, router) {
  router.post('/doit', async function (req, res) {
    if (req.body.action === 'IN') {
      const result = await axios.get(`https://sap-prx.ugmk.com/ummc/permit/main?sap-user=${config.sap.u}&sap-password=${config.sap.p}&action=IN&doknr=${req.body.doknr}&propusk=${req.body.cardNumber}&ckeckpoint=${req.body.ckeckpoint}`)
      console.log(result)
    } else if (req.action === 'RET') {
      const result = await axios.post(`https://sap-prx.ugmk.com/ummc/permit/main?sap-user=${config.sap.u}&sap-password=${config.sap.p}&action=RET&doknr=${req.body.doknr}&ckeckpoint=${req.body.ckeckpoint}`, querystring.stringify({ notes: req.body.notes }))
      console.log(result)
    }
    res.sendStatus(200)
  })
  return router
}
