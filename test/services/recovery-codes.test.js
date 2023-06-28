const assert = require('assert');
const app = require('../../src/app');

describe('\'recovery-codes\' service', () => {
  it('registered the service', () => {
    const service = app.service('recovery-codes');

    assert.ok(service, 'Registered the service');
  });
});
