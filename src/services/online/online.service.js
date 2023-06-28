// Initializes the `online` service on path `/online`
const { Online } = require('./online.class')
const hooks = require('./online.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/online', new Online(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('online')

  service.hooks(hooks)
}
