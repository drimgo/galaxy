const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.params.provider) throw new error.Forbidden('403 - Forbidden')
    return context
  }
}
