const assert = require('assert');
const app = require('../../src/app');

describe('\'kicked\' service', () => {
  it('registered the service', () => {
    const service = app.service('kicked');

    assert.ok(service, 'Registered the service');
  });
});
