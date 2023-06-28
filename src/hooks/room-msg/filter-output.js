const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { params, app } = context
    const { query, user, provider } = params
    if (provider) {
      if (query.roomId) {
        const cache = app.get('cache')
        const room = cache.get('room/'+query.roomId) || await app.service('rooms').get(query.roomId).then(r => {
          cache.set('room/'+r.id, r, 599)
          return r
        })
        if (room.accessMode !== 'open' && !room.whiteList.includes(user.id) && room.userId !== user.id) throw new error.Forbidden('403 - Access restricted to current room.')
        if (room.blackList.includes(user.id)) throw new error.Forbidden('403 - Access restricted. You have been banned from this room.')
      }
    }
    return context
  }
}
