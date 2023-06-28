const error = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, params, app, method, type } = context
    const { query, user, provider } = params
    if (provider) {
      if (!data.result || !data.result.path) throw new error.BadRequest('Cant set user personage: Wrong parameters')
      if (method !== 'create' || type !== 'before') throw new error.BadRequest('Can be requested in before hook of create method')
      await app.service('users').patch(user.id, {
        personage: data.result.path
      }).catch(e => {
        throw new error.BadRequest(e.message)
      })
    } else throw new error.Forbidden('Can be used only from provider')
    return context
  }
}
