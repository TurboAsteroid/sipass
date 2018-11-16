'use strict'
const helpers = require('../helpers')
module.exports = function (app, config, router) {
  router.get('/all51', async function (req, res) {
    res.send(await helpers.getter(51, req, config))
  })
  router.get('/all57', async function (req, res) {
    res.send(await helpers.getter(57, req, config))
  })
  router.get('/all53', async function (req, res) {
    res.send(await helpers.getter(53, req, config))
  })

  return router
}
