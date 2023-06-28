// Initializes the `room-categories` service on path `/room-categories`
const { RoomCategories } = require('./room-categories.class')
const createModel = require('../../models/room-categories.model')
const hooks = require('./room-categories.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      default: 500,
      max: 1000
    }
  }

  // Initialize our service with any options it requires
  app.use('/room-categories', new RoomCategories(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('room-categories')

  service.hooks(hooks)
}
