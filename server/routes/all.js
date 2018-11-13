'use strict'
const helpers = require('../helpers')
module.exports = function (app, config, router) {
  router.get('/all51', async function (req, res) {
    const data = await helpers.getter(51, req, config)
    console.log(data)
    res.send(data)
  })
  router.get('/all57', async function (req, res) {
    const data = await helpers.getter(57, req, config)
    console.log(data)
    res.send(data)
  })
  router.get('/all53', async function (req, res) {
    const data = await helpers.getter(53, req, config)
    console.log(data)
    res.send(data)
  })

  return router
}
