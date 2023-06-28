// Initializes the `mannequin-data` service on path `/mannequin-data`
const { MannequinData } = require('./mannequin-data.class')
const createModel = require('../../models/mannequin-data.model')
const hooks = require('./mannequin-data.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      default: 300,
      max: 350
    }
  }

  // Initialize our service with any options it requires
  app.use('/mannequin-data', new MannequinData(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('mannequin-data')

  service.hooks(hooks)
}
