'use strict'
const mysql = require('mysql2/promise')
module.exports = function (app, config, router) {
  async function logger (user, message, url) {
    try {
      const connection = await mysql.createConnection(config.mariadb)
      await connection.execute(`INSERT INTO gs3.logs_auth(\`user\`, message, url) VALUES('${user}', '${message}', '${url}');`)
      await connection.end()
    } catch (e) {
      console.error(e)
    }
  }
  router.all('*', async function (req, res, next) {
    if (
      req.originalUrl === '/auth/login' ||
      req.originalUrl === '/photobycardid'
    ) {
      await logger('guest', 'guest', '/auth/login')
      next()
    } else if (req.headers.authorization !== undefined && req.headers.authorization !== null) {
      try {
        const token = req.headers.authorization.replace(/Bearer /g, '')
        const decoded = jwt.verify(token, config.jwtSecret)
        await logger(`${decoded.login}`, 'try login', req.originalUrl)
        ad.findUser(decoded.login, async function (err, user) {
          if (err) {
            console.log('ERROR: ' + JSON.stringify(err))
            res.status(403).send(JSON.stringify(err))
            await logger(`${decoded.login}`, 'login failed: server error', req.originalUrl)
            return
          }
          if (!user) {
            console.log(`User: ${decoded.login} not found.`)
            await logger(`${decoded.login}`, 'user not found', req.originalUrl)
          } else {
            console.log(JSON.stringify(user))
            ad.authenticate(decoded.login, decoded.password, async function (err, auth) {
              if (err) {
                console.log('ERROR: ' + JSON.stringify(err))
                res.status(403).send(JSON.stringify(err))
                await logger(`${decoded.login}`, 'password wrong', req.originalUrl)
                return
              }
              if (auth) {
                await logger(`${decoded.login}`, 'authenticated', req.originalUrl)
                console.log(`${decoded.login} Authenticated!`)
                next()
              } else {
                console.log(`${req.body.user} Authenticated failed!`)
                await logger(`${user}`, 'authenticated failed', req.originalUrl)
                res.status(403).send(JSON.stringify(err))
              }
            })
          }
        })
      } catch (err) {
        console.log(500)
        res.status(403).send(err.message)
      }
    } else {
      res.status(403).send('Access denied')
    }
  })

  let ActiveDirectory = require('activedirectory2')
  let ad = new ActiveDirectory(config.ldap)
  const jwt = require('jsonwebtoken')
  router.post('/auth/login', (req, res) => {
    ad.findUser(req.body.user.login, async function (err, user) {
      if (err) {
        console.log('ERROR: ' + JSON.stringify(err))
        res.status(403).send(JSON.stringify(err))
        await logger(`${req.body.user.login}`, err.message, req.originalUrl)
        return
      }
      if (!user) {
        await logger(`${req.body.user.login}`, 'user not found', req.originalUrl)
        console.log(`User: ${req.body.user.login} not found.`)
      } else {
        console.log(JSON.stringify(user))
        ad.authenticate(req.body.user.login, req.body.user.password, async function (err, auth) {
          if (err) {
            await logger(`${req.body.user.login}`, err.message, req.originalUrl)
            console.log('ERROR: ' + JSON.stringify(err))
            res.status(403).send(JSON.stringify(err))
            return
          }
          if (auth) {
            await logger(`${req.body.user.login}`, 'authenticated', req.originalUrl)
            console.log(`${req.body.user.login} Authenticated!`)
            let token = await jwt.sign({login: req.body.user.login, password: req.body.user.password},
              config.jwtSecret,
              {
                expiresIn: '24h'
              })
            res.status(200).send({ auth: true, token: token, user: { name: req.body.user.login, isAdmin: 1 } })
            console.log(token)
            console.log(jwt.verify(token, config.jwtSecret))
          } else {
            await logger(`${req.body.user.login}`, 'authenticated failed', req.originalUrl)
            console.log(`${req.body.user} Authenticated failed!`)
            res.status(403).send(JSON.stringify(err))
          }
        })
      }
    })
  })
  return router
}
