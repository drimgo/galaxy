const assert = require('assert');
const app = require('../../src/app');

describe('\'online\' service', () => {
  it('registered the service', () => {
    const service = app.service('online');

    assert.ok(service, 'Registered the service');
  });
});
