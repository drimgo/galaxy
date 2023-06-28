/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')

module.exports = (options = {}) => {
  return async context => {
    const { params, app, data } = context
    const { provider } = params
    if (provider) {
      if (!data.password || !data.userId || !data.secretCode) throw new error.BadRequest('Parameters error')
      const codeEntry = await app.service('recovery-codes').find({
        query: {
          userId: data.userId,
          code: data.secretCode
        }
      }).then(r => {
        if (!r.data.length) throw new error.BadGateway('Secret code error')
        return r.data[0]
      }).catch(e => {
        throw new error.BadGateway('Secret code error')
      })
      await app.service('users').patch(data.userId, {
        password: data.password
      }).then(u => {
        delete u.password
        return u
      }).catch(e => {
        throw new error.BadGateway('Can not change user password')
      })
      await app.service('recovery-codes').remove(codeEntry.id).catch(e => {
        throw new error.BadGateway('Error #2')
      })
    } else throw new error.Forbidden('403 - Not allowed for internal calls')
    return context
  }
}
