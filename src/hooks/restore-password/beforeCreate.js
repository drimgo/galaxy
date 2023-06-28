/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const cryptoRandomString = require('crypto-random-string')
const { sendEmail } = require('./utils/sendRestoringMail')

function isEmail (email = null) {
  if (!email) throw new error.BadRequest('Empty data')
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
module.exports = (options = {}) => {
  return async context => {
    const { params, app, data } = context
    const { provider } = params
    if (provider) {
      if (params.user) throw new error.Forbidden('Access restricted for authenticated users')
      const queryBuilder = isEmail(data.identity) ? { email: data.identity } : { nickname: data.identity }
      const user = await app.service('users').find({
        query: {
          ...queryBuilder
        }
      }).then(d => d.data[0]) || null
      if (!user.email) throw new error.BadGateway('User was not found')
      const rndStr = cryptoRandomString({ length: 26, type: 'url-safe' })
      await app.service('recovery-codes').create({
        code: rndStr,
        userId: user.id
      }).catch(e => {
        throw new error.BadGateway('Error #1')
      })
      const result = await sendEmail(user.email, rndStr, user)
      context.result = {
        result: result,
      }
    }
    return context
  }
}
