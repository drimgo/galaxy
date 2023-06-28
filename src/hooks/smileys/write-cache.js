// eslint-disable-next-line no-unused-vars
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { app, result } = context
    const cache = app.get('cache')
    if (cache.get('smileys')) cache.del('smileys')
    cache.set('smileys', result.data)
    return context
  }
}