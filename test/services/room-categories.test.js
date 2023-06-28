const assert = require('assert');
const app = require('../../src/app');

describe('\'room-categories\' service', () => {
  it('registered the service', () => {
    const service = app.service('room-categories');

    assert.ok(service, 'Registered the service');
  });
});
