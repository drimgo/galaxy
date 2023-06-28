/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { data, type, method } = context
    if (type === 'before' && method === 'create') {
      if (data.firstName.length < 3 || data.firstName.length > 12) throw new error.BadRequest('Check first name length')
      if (data.lastName.length < 3 || data.lastName.length > 12) throw new error.BadRequest('Check last name length')
      if (data.nickname.length < 3 || data.nickname.length > 12) throw new error.BadRequest('Check nickname name length')
      // eslint-disable-next-line no-useless-escape
      let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!emailPattern.test(String(data.email).toLowerCase())) throw new error.BadRequest('Email is not valid')
      
      data.role = 'usr'
    }
    return context
  }
}
