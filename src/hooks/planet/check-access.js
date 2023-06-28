/* eslint-disable no-unused-vars */
const error = require('@feathersjs/errors')
module.exports = (options = {}) => {
  return async context => {
    const { params, app, id } = context
    const { user, provider } = params
    if (provider) {
      if (!id) throw new error.BadRequest('Can not verify access: ID was not specified')
      const room = await app.service('rooms').find({
        query: {
          planetId: id
        }
      }).then(r => r.data[0]).catch(e => {
        throw new error.BadRequest(e.message)
      })
      if (room.userId !== user.id && user.role === 'usr') throw new error.Forbidden('Access restricted')
    }
    return context
  }
}
