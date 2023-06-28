const { authenticate } = require('@feathersjs/authentication').hooks
const createEntries = require('../../hooks/uploads/create-entries')
const checkPermits = require('../../hooks/uploads/check_permits')
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [checkPermits(), createEntries() ],
    update: [checkPermits() ],
    patch: [checkPermits() ],
    remove: [checkPermits() ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
