// eslint-disable-next-line no-unused-vars
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { id, app } = context
    const cache = app.get('cache')
    if (cache.get('user/'+id)) cache.del('user/'+id)
    return context
  }
}
