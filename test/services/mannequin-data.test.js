const assert = require('assert');
const app = require('../../src/app');

describe('\'mannequin-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('mannequin-data');

    assert.ok(service, 'Registered the service');
  });
});
