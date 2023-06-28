const { authenticate } = require('@feathersjs/authentication').hooks
const invalidateCache = require('../../hooks/planet/invalidate-cache')
const checkAccess = require('../../hooks/planet/check-access')
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [ checkAccess() ],
    patch: [ checkAccess() ],
    remove: [ checkAccess() ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [ invalidateCache() ],
    patch: [ invalidateCache() ],
    remove: [ invalidateCache() ]
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
}
