const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { params, app } = context
    const { query, user, provider } = params
    if (provider) {
      const cache = app.get('cache')
      const room = cache.get('room/'+query.roomId) || await app.service('rooms').get(query.roomId).then(r => {
        cache.set('room/'+r.id, r, 599)
        return r
      })
      if (room.accessMode !== 'open' && !room.whiteList.includes(user.id) && room.userId !== user.id) throw new error.Forbidden('403 - Access restricted for this room')
      if (room.blackList.includes(user.id)) throw new error.Forbidden('403 - Access restricted. You have been banned from this room.')
      if (user.roomId !== query.roomId) {
        if (user.roomId) app.service('room-acts').remove(null, {
          userId: user.id,
          roomId: user.roomId
        }).catch(e => console.log('cant remove room-acts ', e.message))
        if (query && query.roomId) await app.service('users').patch(user.id, {
          roomId: query.roomId
        }).then(() => {
          app.service('room-acts').create({
            userId: user.id,
            roomId: query.roomId
          }).catch(e => console.log('cant create room-acts ', e.message))
        }).catch(e => {
          console.log('cannot patch user for current room id')
        })
      }
    }
    return context
  }
}
