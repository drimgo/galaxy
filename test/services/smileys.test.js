const assert = require('assert');
const app = require('../../src/app');

describe('\'smileys\' service', () => {
  it('registered the service', () => {
    const service = app.service('smileys');

    assert.ok(service, 'Registered the service');
  });
});
