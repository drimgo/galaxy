/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params } = context
    const { provider } = params
    if (provider) throw new error.Forbidden('403 - Access restricted')
    return context
  }
}
