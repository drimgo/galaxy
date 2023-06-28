const assert = require('assert');
const app = require('../../src/app');

describe('\'pushsub\' service', () => {
  it('registered the service', () => {
    const service = app.service('pushsub');

    assert.ok(service, 'Registered the service');
  });
});
