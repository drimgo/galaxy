// Initializes the `pushsub` service on path `/pushsub`
const { Pushsub } = require('./pushsub.class');
const hooks = require('./pushsub.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/pushsub', new Pushsub(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pushsub');

  service.hooks(hooks);
};
