// eslint-disable-next-line no-unused-vars
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, data } = context
    const { provider, user } = params
    if (provider) {
      context.data.userId = user.id
    }
    return context
  }
}
