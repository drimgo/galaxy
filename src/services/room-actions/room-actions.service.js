// Initializes the `room-actions` service on path `/room-actions`
const { RoomActions } = require('./room-actions.class');
const hooks = require('./room-actions.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/room-actions', new RoomActions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('room-actions');

  service.hooks(hooks);
};
