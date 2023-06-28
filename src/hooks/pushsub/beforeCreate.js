/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { data } = context
    console.log('PUSHSUB_CREATED', data)
    context.result = {
      result: 'ok',
      message: 'Token accepted'
    }
    return context
  }
}