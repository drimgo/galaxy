// eslint-disable-next-line no-unused-vars
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { app } = context
    const cache = app.get('cache')
    if (cache.get('smileys')) cache.del('smileys')
    return context
  }
}