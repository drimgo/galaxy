const assert = require('assert');
const app = require('../../src/app');

describe('\'mannequin\' service', () => {
  it('registered the service', () => {
    const service = app.service('mannequin');

    assert.ok(service, 'Registered the service');
  });
});
