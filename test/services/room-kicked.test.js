const assert = require('assert');
const app = require('../../src/app');

describe('\'room-kicked\' service', () => {
  it('registered the service', () => {
    const service = app.service('room-kicked');

    assert.ok(service, 'Registered the service');
  });
});
