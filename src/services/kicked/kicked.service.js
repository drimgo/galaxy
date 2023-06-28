// Initializes the `kicked` service on path `/kicked`
const { Kicked } = require('./kicked.class');
const hooks = require('./kicked.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/kicked', new Kicked(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('kicked');

  service.hooks(hooks);
};
