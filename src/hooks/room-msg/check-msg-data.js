/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { data, params, app, method, type } = context
    const { query, user, provider } = params
    if (!data.text || data.text.trim().length < 2) throw new error.BadRequest('Short message')
    return context
  }
}
