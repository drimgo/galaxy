/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, id } = context
    const { user, provider } = params
    if (provider) {
      if (user.role === 'usr') {
        if (id !== user.id) throw new error.Forbidden('403 Access error')
      }
    }
    return context
  }
}
