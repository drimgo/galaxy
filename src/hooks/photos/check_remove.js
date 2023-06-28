/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, app, data, id } = context
    const { provider, user } = params
    if (provider) {
      if (!user) throw new error.Forbidden('Access restricted for unauthenticated users')
      if (!id) throw new error.BadRequest('ID was not sended')
      const photo = await app.service('photos').get(id).catch(e => {
        throw new error.BadGateway(e.message)
      })
      if (photo.userId !== user.id && user.role === 'user') throw new error.Forbidden('Access restricted #1')
    }
    return context
  }
}
