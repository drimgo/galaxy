const assert = require('assert');
const app = require('../../src/app');

describe('\'restore-password\' service', () => {
  it('registered the service', () => {
    const service = app.service('restore-password');

    assert.ok(service, 'Registered the service');
  });
});
