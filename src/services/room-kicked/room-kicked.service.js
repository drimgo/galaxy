// Initializes the `room-kicked` service on path `/room-kicked`
const { RoomKicked } = require('./room-kicked.class');
const createModel = require('../../models/room-kicked.model');
const hooks = require('./room-kicked.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/room-kicked', new RoomKicked(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('room-kicked');

  service.hooks(hooks);
};
