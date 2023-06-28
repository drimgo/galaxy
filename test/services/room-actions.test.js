const assert = require('assert');
const app = require('../../src/app');

describe('\'room-actions\' service', () => {
  it('registered the service', () => {
    const service = app.service('room-actions');

    assert.ok(service, 'Registered the service');
  });
});
