const assert = require('assert');
const app = require('../../src/app');

describe('\'room-msg\' service', () => {
  it('registered the service', () => {
    const service = app.service('room-msg');

    assert.ok(service, 'Registered the service');
  });
});
