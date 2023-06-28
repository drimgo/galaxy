const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { result, app } = context
    const cache = app.get('cache')
    if (Array.isArray(result)) {
      await Promise.all(result.map(room => {
        if (cache.del('room/'+room.id)) {
          console.log('cache invalidated for room ' + room.id)
        } else console.log('unabled invalidate cache')
      }))
    } else {
      if (cache.del('room/'+result.id)) {
        console.log('cache invalidated for room ' + result.id)
      } else console.log('unabled invalidate cache')
    }
    return context
  }
}
