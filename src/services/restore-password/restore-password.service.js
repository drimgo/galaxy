// Initializes the `restore-password` service on path `/restore-password`
const { RestorePassword } = require('./restore-password.class');
const hooks = require('./restore-password.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/restore-password', new RestorePassword(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('restore-password');

  service.hooks(hooks);
};
