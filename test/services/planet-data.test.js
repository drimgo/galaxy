const assert = require('assert');
const app = require('../../src/app');

describe('\'planet-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('planet-data');

    assert.ok(service, 'Registered the service');
  });
});
