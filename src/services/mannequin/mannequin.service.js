// Initializes the `mannequin` service on path `/mannequin`
const { Mannequin } = require('./mannequin.class');
const hooks = require('./mannequin.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/mannequin', new Mannequin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mannequin');

  service.hooks(hooks);
};
