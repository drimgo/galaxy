// Initializes the `room-acts` service on path `/room-acts`
const { RoomActs } = require('./room-acts.class')
const hooks = require('./room-acts.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/room-acts', new RoomActs(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('room-acts')

  service.hooks(hooks)
}
