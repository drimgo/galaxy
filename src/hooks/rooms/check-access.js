const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { params, id, app } = context
    const { user, provider } = params
    if (provider) {
      const room = await app.service('rooms').get(id).catch(e => {
        throw new error.BadRequest(e.message)
      })
      if (user.role === 'usr') {
        if (room.userId !== user.id) throw new error.Forbidden('403 Access error')
      }
    }
    return context
  }
}
