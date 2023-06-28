// Initializes the `recovery-codes` service on path `/recovery-codes`
const { RecoveryCodes } = require('./recovery-codes.class');
const createModel = require('../../models/recovery-codes.model');
const hooks = require('./recovery-codes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/recovery-codes', new RecoveryCodes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('recovery-codes');

  service.hooks(hooks);
};
