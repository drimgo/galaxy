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
        await Promise.all(diff.map(async u => {
          if (room.whiteList.includes(u)) {
            await app.service('rooms').patch(room.id, {
              whiteList: room.whiteList.filter(wlu => wlu !== u)
            }).catch(e => {
              throw new error.BadGateway(e.message)
            })
          }
          await app.service('users').patch(u, {
            roomId: null
          }).catch(e => {
            throw new error.BadGateway(e.message)
          })
        }))
      }
      if (data.whiteList && Array.isArray(data.whiteList) && data.whiteList.length) {
        const diff = data.whiteList.filter(u => !room.whiteList.includes(u))
        await Promise.all(diff.map(async u => {
          if (room.blackList.includes(u)) {
            await app.service('rooms').patch(room.id, {
              blackList: room.blackList.filter(wlu => wlu !== u)
            }).catch(e => {
              throw new error.BadGateway(e.message)
            })
          }
        }))
      }
    }
    return context
  }
}
