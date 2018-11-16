'use strict'
const mysql = require('mysql2/promise')
const _ = require('underscore')
const helpers = require('../helpers')
module.exports = function (app, config, router) {
  async function logger (user, message, url, req) {
    try {
      const connection = await mysql.createConnection(config.mariadb)
      await connection.execute(`INSERT INTO gs3.logs_auth(\`user\`, message, url, ip) VALUES('${user}', '${message}', '${url}', '${req.connection.remoteAddress}');`)
      await connection.end()
    } catch (e) {
      console.error(e)
    }
  }
  router.all('*', async function (req, res, next) {
    if (
      req.originalUrl === '/auth/login' || req.originalUrl === '/getallphotos'
    ) {
      await logger('guest', 'guest', '/auth/login', req)
      next()
    } else if ((req.headers.authorization !== undefined && req.headers.authorization !== null) || (req.query.jwt !== undefined && req.query.jwt !== null)) {
      try {
        let token = ''
        if (req.query.jwt !== undefined && req.query.jwt !== null) {
          token = req.query.jwt
        } else {
          token = req.headers.authorization.replace(/Bearer /g, '')
        }
        const decoded = jwt.verify(token, config.jwtSecret)
        await logger(`${decoded.login}`, 'try login', req.originalUrl, req)
        ad.findUser(decoded.login, async function (err, user) {
          if (err) {
            console.log('ERROR: ' + JSON.stringify(err))
            res.status(403).send(JSON.stringify(err))
            await logger(`${decoded.login}`, 'login failed: server error', req.originalUrl, req)
            return
          }
          if (!user) {
            console.log(`User: ${decoded.login} not found.`)
            await logger(`${decoded.login}`, 'user not found', req.originalUrl, req)
            res.status(403).send('Access denied')
          } else {
            console.log(JSON.stringify(user))
            ad.authenticate(decoded.login, decoded.password, async function (err, auth) {
              if (err) {
                console.log('ERROR: ' + JSON.stringify(err))
                res.status(403).send(JSON.stringify(err))
                await logger(`${decoded.login}`, 'password wrong', req.originalUrl, req)
                return
              }
              await logger(`${decoded.login}`, 'authenticated', req.originalUrl, req)
              console.log(`${decoded.login} Authenticated!`)
              // получаем права из моей базы, если прав нет, то доступ закрыт
              let permissions = await helpers.userPermissions(decoded.login, config.mariadb)

              if (auth && _.isEqual(permissions, decoded.permissions) && Object.keys(permissions).length > 0) {
                req.locals = { permissions: permissions, user: decoded.login }
                next()
              } else {
                console.log(`${req.body.user} Authenticated failed!`)
                await logger(`${user}`, 'authenticated failed', req.originalUrl, req)
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
        await logger(`${req.body.user.login}`, err.message, req.originalUrl, req)
        return
      }
      if (!user) {
        await logger(`${req.body.user.login}`, 'user not found', req.originalUrl, req)
        console.log(`User: ${req.body.user.login} not found.`)
        res.status(403).send('Access denied')
      } else {
        console.log(JSON.stringify(user))
        ad.authenticate(req.body.user.login, req.body.user.password, async function (err, auth) {
          if (err) {
            await logger(`${req.body.user.login}`, err.message, req.originalUrl, req)
            console.log('ERROR: ' + JSON.stringify(err))
            res.status(403).send(JSON.stringify(err))
            return
          }
          if (auth) {
            await logger(`${req.body.user.login}`, 'authenticated', req.originalUrl, req)
            console.log(`${req.body.user.login} Authenticated!`)
            // получаем права из моей базы, если прав нет, то доступ закрыт
            let permissions = await helpers.userPermissions((req.body.user.login.split('@'))[0], config.mariadb)
            if (Object.keys(permissions).length > 0) {
              let allowedKpps = helpers.filterKPPS(config.kpps, permissions)
              allowedKpps.push({text: 'Все доступные', value: 'all'})
              console.log(allowedKpps)
              let token = await jwt.sign({
                login: req.body.user.login,
                password: req.body.user.password,
                permissions: permissions
              }, config.jwtSecret, {expiresIn: 365 * 24 + 'h'})
              res.status(200).send({token: token, globalUserData: {permissions: permissions, kpps: allowedKpps}})
              console.log(token)
              console.log(jwt.verify(token, config.jwtSecret))
            } else {
              await logger(`${req.body.user.login}`, 'authenticated failed', req.originalUrl, req)
              console.log(`${req.body.user.login} Authenticated failed!`)
              res.status(403).send(JSON.stringify(err))
            }
          } else {
            await logger(`${req.body.user.login}`, 'authenticated failed', req.originalUrl, req)
            console.log(`${req.body.user.login} Authenticated failed!`)
            res.status(403).send(JSON.stringify(err))
          }
        })
      }
    })
  })
  return router
}
