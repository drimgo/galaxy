/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
function isEmail (email = null) {
  if (!email) throw new error.BadRequest('Empty data')
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
module.exports = (options = {}) => {
  return async context => {
    const { params, app } = context
    const { query } = params
    const { provider } = params
    if (provider) {
      if (params.user) throw new error.Forbidden('Access restricted for authenticated users')
      const queryBuilder = isEmail(query.identity) ? { email: query.identity } : { nickname: query.identity }
      const user = await app.service('users').find({
        query: {
          ...queryBuilder
        }
      }).then(d => d.data[0] || null) || null
      context.result = {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage ? user.profileImage[0] : null,
          gender: user.gender
        }
      }
    }
    return context
  }
}
