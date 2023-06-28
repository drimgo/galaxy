// Initializes the `planet-xy` service on path `/planet-xy`
const { PlanetXy } = require('./planet-xy.class');
const hooks = require('./planet-xy.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/planet-xy', new PlanetXy(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('planet-xy');

  service.hooks(hooks);
};
