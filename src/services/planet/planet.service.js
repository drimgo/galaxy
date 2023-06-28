// Initializes the `planet` service on path `/planet`
const { Planet } = require('./planet.class');
const createModel = require('../../models/planet.model');
const hooks = require('./planet.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/planet', new Planet(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('planet');

  service.hooks(hooks);
};
