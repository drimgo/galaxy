/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const fs = require('fs')

module.exports = (options = {}) => {
  return async context => {
    const { result } = context
    if (result.path) fs.unlinkSync(process.cwd() + '/public/' + result.path)
    return context
  }
}
