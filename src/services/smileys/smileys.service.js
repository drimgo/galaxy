// Initializes the `smileys` service on path `/smileys`
const { Smileys } = require('./smileys.class');
const createModel = require('../../models/smileys.model');
const hooks = require('./smileys.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      default: 2000,
      max: 3000
    }
  };

  // Initialize our service with any options it requires
  app.use('/smileys', new Smileys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('smileys');

  service.hooks(hooks);
};
