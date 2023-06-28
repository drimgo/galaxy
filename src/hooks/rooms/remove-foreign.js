const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { id, app } = context
    const cache = app.get('cache')
    if (cache.get('room/'+id)) cache.del('room/'+id)
    await app.service('room-msg').remove(null, {
      query: {
        roomId: id
      }
    }).catch(e => {
      console.log('can not remove foreign room messages')
    })
    return context
  }
}
