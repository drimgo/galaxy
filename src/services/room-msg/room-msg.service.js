// Initializes the `room-msg` service on path `/room-msg`
const { RoomMsg } = require('./room-msg.class')
const createModel = require('../../models/room-msg.model')
const hooks = require('./room-msg.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/room-msg', new RoomMsg(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('room-msg')

  service.hooks(hooks)
}
