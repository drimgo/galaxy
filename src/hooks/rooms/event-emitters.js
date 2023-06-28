/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { data, app, method, id } = context
    const cache = app.get('cache')
    if (method === 'patch' || method === 'update') {
      const room = cache.get('room/'+id) || await app.service('rooms').get(id).then(r => {
        cache.set('room/'+id, r, 599)
        return r
      })
      if (data.blackList && Array.isArray(data.blackList) && data.blackList.length) {
        const diff = data.blackList.filter(u => !room.blackList.includes(u))
        await Promise.all(diff.map(u => {
          console.log('must quitted ', u)
          app.service('room-acts').remove(null, {
            userId: u,
            roomId: room.id
          })
        }))
      }
    }
    return context
  }
}
