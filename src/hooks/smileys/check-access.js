/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const checkPermissions = require('feathers-permissions')
module.exports = (options = {}) => {
  return async context => {
    const { params } = context
    const { provider, user } = params
    if (!provider) return context
    if (!user) throw new error.Forbidden('403 - Access restricted #1')
    if (!user.role === 'usr') throw new error.Forbidden('403 - Access restricted #2')
    return context
  }
}
