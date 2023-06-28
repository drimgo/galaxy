/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, data, app, path } = context
    const { provider, user } = params
    if (provider) {
      if (user && !user.isOnline) {
        await app.service('users').patch(user.id, {
          isOnline: true
        }).then(u => {
          delete u.password
          delete u.role
          delete u.email
          app.service('online').create({
            user: u
          }).catch(e => {
            console.log('can not set user online', e)
          })
        }).catch(e => {
          throw new error.BadGateway(e.message)
        })
      }
    }
    return context
  }
}
