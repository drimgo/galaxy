const assert = require('assert');
const app = require('../../src/app');

describe('\'planet\' service', () => {
  it('registered the service', () => {
    const service = app.service('planet');

    assert.ok(service, 'Registered the service');
  });
});
