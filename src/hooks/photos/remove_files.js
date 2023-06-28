/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
const fs = require('fs')
module.exports = (options = {}) => {
  return async context => {
    const { app, id } = context
    if (!id) throw new error.BadRequest('Photo id was not specified')
    const photo = await app.service('photos').get(id).catch(e => {
      throw new error.BadGateway(e.message)
    })
    fs.unlinkSync(process.cwd() + '/public/' + photo.path)
    fs.unlinkSync(process.cwd() + '/public/' + photo.previewPath)
    return context
  }
}
