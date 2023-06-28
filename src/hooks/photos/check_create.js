/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, app, data } = context
    const { provider, user } = params
    if (provider) {
      if (!user) throw new error.Forbidden('Access restricted for unauthenticated users')
      data.userId = user.id
      if (data.description && data.description.length > 200) throw new error.BadRequest('Description characters limit: 200 symbols')
    }
    return context
  }
}
