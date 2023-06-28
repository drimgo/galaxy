const assert = require('assert');
const app = require('../../src/app');

describe('\'planet-xy\' service', () => {
  it('registered the service', () => {
    const service = app.service('planet-xy');

    assert.ok(service, 'Registered the service');
  });
});
