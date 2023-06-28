// Initializes the `planet-data` service on path `/planet-data`
const { PlanetData } = require('./planet-data.class')
const createModel = require('../../models/planet-data.model')
const hooks = require('./planet-data.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      default: 500,
      max: 550
    }
  }

  // Initialize our service with any options it requires
  app.use('/planet-data', new PlanetData(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('planet-data')

  service.hooks(hooks)
}
