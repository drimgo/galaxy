const assert = require('assert');
const app = require('../../src/app');

describe('\'room-acts\' service', () => {
  it('registered the service', () => {
    const service = app.service('room-acts');

    assert.ok(service, 'Registered the service');
  });
});
