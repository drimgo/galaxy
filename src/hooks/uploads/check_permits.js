/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const checkPermissions = require('feathers-permissions')
module.exports = (options = {}) => {
  return async context => {
    const { params, data } = context
    const { provider, user } = params
    if (!provider) throw new error.BadRequest('Can not call this service by internal')
    if (!data.type) throw new error.BadRequest('Upload type was not specified')
    if (data.type !== 'photo') {
      if (user.role === 'usr') throw new error.Forbidden(`Access restricted for uploading type "${data.type}"`)
    }
    return context
  }
}
