const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, params, app, method, type } = context
    const { query, user, provider } = params
    if (provider) {
      const cache = app.get('cache')
      if (method === 'create') {
        if (type === 'before') {
          if (!data.roomId) throw new error.BadRequest('Room ID not specified')
          const room = cache.get('room/'+data.roomId) || await app.service('rooms').get(data.roomId).then(r => {
            cache.set('room/'+r.id, r, 599)
            return r
          })
          if (room.accessMode === 'close' && !room.whiteList.includes(user.id) && room.userId !== user.id) throw new error.Forbidden('403 - Access restricted for sending messages to this room')
          if (room.blackList.includes(user.id)) throw new error.Forbidden('403 - Access restricted for sending messages to this room')
        }
      }
    }
    return context
  }
}
